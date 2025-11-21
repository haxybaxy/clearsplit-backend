import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { DataSource } from 'typeorm';
import { UserService } from '@modules/user/user.service';
import { TeamService } from '@modules/team/team.service';
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

    // Create user and personal team in a transaction
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

          // Create personal team with the user as owner
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
      // TODO: Consider rolling back Supabase user creation if database operations fail
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
}
