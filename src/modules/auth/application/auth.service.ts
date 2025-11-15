import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { UserService } from '@modules/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { envConfig } from '@config/env.config';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private readonly userService: UserService) {
    const supabaseUrl: string = envConfig.get('SUPABASE_URL');
    const supabaseKey: string = envConfig.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signupDto;

    // Check if user already exists in our database
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      throw new UnauthorizedException(
        authError.message || 'Failed to create user in Supabase',
      );
    }

    if (!authData.user || !authData.session) {
      throw new InternalServerErrorException(
        'Supabase signup succeeded but no user or session was returned',
      );
    }

    // Sync user to our database
    try {
      const dbUser = await this.userService.create({
        email,
        firstName,
        lastName,
        supabaseId: authData.user.id,
      });

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
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to sync user to database after Supabase signup',
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Authenticate with Supabase
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user || !authData.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Find user in our database
    const dbUser = await this.userService.findBySupabaseId(authData.user.id);

    if (!dbUser) {
      // User exists in Supabase but not in our DB - this shouldn't happen
      // but we can handle it by creating the user
      throw new InternalServerErrorException(
        'User authentication succeeded but user not found in database',
      );
    }

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

  async validateUser(supabaseId: string) {
    const user = await this.userService.findBySupabaseId(supabaseId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
