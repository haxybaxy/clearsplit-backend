import { z } from 'zod';

export const CreateContactDtoSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  teamId: z.uuid('Team ID must be a valid UUID'),
  email: z.email('Invalid email format').optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateContactDto = z.infer<typeof CreateContactDtoSchema>;
