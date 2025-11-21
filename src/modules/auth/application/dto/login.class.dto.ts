import { ApiProperty } from '@nestjs/swagger';

/**
 * Class-based DTO for Swagger documentation
 * Validation is still handled by LoginDtoSchema (Zod)
 */
export class LoginClassDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecureP@ssw0rd',
    format: 'password',
  })
  password: string;
}
