import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatars/john.jpg',
    required: false,
    nullable: true,
  })
  avatarUrl?: string;
}

/**
 * Class-based DTO for Swagger documentation
 */
export class AuthResponseClassDto {
  @ApiProperty({
    description: 'JWT access token for authentication (expires in 7 days)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: 'v1.MRjHJoHe...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Authenticated user information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
