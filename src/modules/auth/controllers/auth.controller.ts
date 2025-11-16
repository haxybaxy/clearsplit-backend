import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '@modules/auth/application/auth.service';
import {
  SignupDto,
  SignupDtoSchema,
} from '@modules/auth/application/dto/signup.dto';
import {
  LoginDto,
  LoginDtoSchema,
} from '@modules/auth/application/dto/login.dto';
import { JwtAuthGuard } from '@modules/auth/infra/api/guard/jwt-auth.guard';
import { ZodError } from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: unknown) {
    try {
      const signupDto: SignupDto = SignupDtoSchema.parse(body);
      return await this.authService.signup(signupDto);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown) {
    try {
      const loginDto: LoginDto = LoginDtoSchema.parse(body);
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatarUrl: req.user.avatarUrl,
    };
  }
}
