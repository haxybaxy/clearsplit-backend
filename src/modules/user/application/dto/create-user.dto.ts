import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  avatarUrl: z.string().url('Avatar URL must be a valid URL').optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
