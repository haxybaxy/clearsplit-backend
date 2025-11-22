import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { UserService } from '@modules/user/application/user.service';
import { TeamService } from '@modules/team/application/team.service';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { envConfig } from '@config/env.config';
import { LoggerService } from '@src/common/logger';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private readonly context = 'AuthService';

  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    const supabaseUrl: string = envConfig.get('SUPABASE_URL');
    const supabaseKey: string = envConfig.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signupDto;
    const defaultCurrencyId = 'EUR';

    this.logger.info(
      `Signup attempt for email: ${email}`,
      undefined,
      this.context,
    );

    // Check if user already exists in our database
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Signup failed - user already exists: ${email}`,
        this.context,
      );
      throw new ConflictException('User with this email already exists');
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      this.logger.errorWithData(
        `Supabase signup failed for ${email}`,
        { error: authError.message },
        this.context,
      );
      throw new UnauthorizedException(
        authError.message || 'Failed to create user in Supabase',
      );
    }

    if (!authData.user || !authData.session) {
      this.logger.error(
        `Supabase signup returned no user/session for ${email}`,
        undefined,
        this.context,
      );
      throw new InternalServerErrorException(
        'Supabase signup succeeded but no user or session was returned',
      );
    }

    this.logger.debug(
      `Supabase user created: ${authData.user.id}`,
      this.context,
    );

    const supabaseUserId = authData.user.id;

    try {
      const dbUser = await this.dataSource.transaction(
        async (entityManager) => {
          // Create user in database using Supabase ID as primary key
          const user = await this.userService.create(
            {
              id: authData.user.id,
              email,
              firstName,
              lastName,
            },
            entityManager,
          );

          const personalTeamName = `${firstName}'s Team`;
          await this.teamService.createTeamWithOwner(
            user.id,
            personalTeamName,
            defaultCurrencyId,
            entityManager,
          );

          return user;
        },
      );

      this.logger.info(
        `Signup successful for user: ${dbUser.id}`,
        undefined,
        this.context,
      );

      return {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          avatarUrl: dbUser.avatarUrl,
        },
      };
    } catch (error) {
      this.logger.errorWithData(
        `Database transaction failed for signup: ${email}`,
        { error: error instanceof Error ? error.message : String(error) },
        this.context,
      );

      await this.rollbackSupabaseUser(supabaseUserId, email);

      throw new InternalServerErrorException(
        'Failed to create user and team in database after Supabase signup',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    this.logger.info(
      `Login attempt for email: ${email}`,
      undefined,
      this.context,
    );

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user || !authData.session) {
      this.logger.warn(`Login failed for email: ${email}`, this.context);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Find user in our database (user.id = Supabase auth ID)
    let dbUser: DBUser | null = null;
    try {
      dbUser = await this.userService.findById(authData.user.id);
    } catch {
      dbUser = null;
    }

    if (!dbUser) {
      // User exists in Supabase but not in our DB - this shouldn't happen
      // but we can handle it by creating the user
      this.logger.error(
        `User not in DB after Supabase auth: ${authData.user.id}`,
        undefined,
        this.context,
      );
      throw new InternalServerErrorException(
        'User authentication succeeded but user not found in database',
      );
    }

    this.logger.info(
      `Login successful for user: ${dbUser.id}`,
      undefined,
      this.context,
    );

    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        avatarUrl: dbUser.avatarUrl,
      },
    };
  }

  async validateUser(userId: string): Promise<DBUser> {
    let user: DBUser | null = null;
    try {
      user = await this.userService.findById(userId);
    } catch {
      user = null;
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Rollback Supabase user creation when database operations fail.
   * This is a compensating transaction to maintain consistency between
   * Supabase Auth and our PostgreSQL database.
   */
  private async rollbackSupabaseUser(
    supabaseUserId: string,
    email: string,
  ): Promise<void> {
    try {
      const { error: deleteError } =
        await this.supabase.auth.admin.deleteUser(supabaseUserId);

      if (deleteError) {
        // Log the failure but don't throw - we don't want to mask the original error
        this.logger.errorWithData(
          `Failed to rollback Supabase user after DB failure`,
          {
            supabaseUserId,
            email,
            deleteError: deleteError.message,
          },
          this.context,
        );
      } else {
        this.logger.info(
          `Successfully rolled back Supabase user: ${supabaseUserId}`,
          undefined,
          this.context,
        );
      }
    } catch (rollbackError) {
      // Log but don't throw - preserve the original error context
      this.logger.errorWithData(
        `Exception during Supabase user rollback`,
        {
          supabaseUserId,
          email,
          error:
            rollbackError instanceof Error
              ? rollbackError.message
              : String(rollbackError),
        },
        this.context,
      );
    }
  }
}
