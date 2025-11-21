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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
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
import { SignupClassDto } from '@modules/auth/application/dto/signup.class.dto';
import { LoginClassDto } from '@modules/auth/application/dto/login.class.dto';
import {
  AuthResponseClassDto,
  UserResponseDto,
} from '@modules/auth/application/dto/auth-response.class.dto';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponseCustom,
  ApiConflictResponseCustom,
  ApiInternalServerErrorResponseCustom,
} from '@src/common/decorators/api-responses.decorator';
import type { AuthenticatedRequest } from '@modules/auth/infra/api/types/authenticated-request.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with Supabase authentication, ' +
      'syncs user data to the database, and automatically creates a personal team ' +
      'with the user as the owner. Returns JWT tokens for authentication.',
  })
  @ApiBody({ type: SignupClassDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered with personal team created',
    type: AuthResponseClassDto,
  })
  @ApiBadRequestResponse()
  @ApiConflictResponseCustom('User with this email already exists')
  @ApiInternalServerErrorResponseCustom()
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
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Authenticates user credentials with Supabase and returns JWT tokens. ' +
      'Use the accessToken in the Authorization header as "Bearer {token}" for protected endpoints.',
  })
  @ApiBody({ type: LoginClassDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseClassDto,
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponseCustom()
  @ApiInternalServerErrorResponseCustom()
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current authenticated user',
    description:
      'Returns the profile information of the currently authenticated user. ' +
      'Requires a valid JWT token in the Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponseCustom()
  @ApiInternalServerErrorResponseCustom()
  getCurrentUser(@Request() req: AuthenticatedRequest): UserResponseDto {
    return {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatarUrl: req.user.avatarUrl ?? undefined,
    };
  }
}
