import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './infra/api/strategy/jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { envConfig } from '@config/env.config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envConfig.get('SUPABASE_JWT_SECRET'),
      signOptions: {
        expiresIn: '7d', // This is just for reference, actual tokens come from Supabase
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
