import { ApiProperty } from '@nestjs/swagger';

/**
 * Class-based DTO for Swagger documentation
 * Validation is still handled by SignupDtoSchema (Zod)
 */
export class SignupClassDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'SecureP@ssw0rd',
    minLength: 6,
    format: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
  })
  lastName: string;
}
