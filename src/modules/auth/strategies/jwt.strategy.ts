import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { envConfig } from '@config/env.config';

export interface JwtPayload {
  sub: string; // Supabase user ID
  email: string;
  aud: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const jwtSecret: string = envConfig.get('SUPABASE_JWT_SECRET');

    if (!jwtSecret) {
      throw new Error(
        'SUPABASE_JWT_SECRET is not configured in environment variables',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      audience: 'authenticated',
    });
  }

  async validate(payload: JwtPayload) {
    // Validate that the user exists in our database
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user object that will be attached to request.user
    return {
      id: user.id,
      supabaseId: user.supabaseId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    };
  }
}
