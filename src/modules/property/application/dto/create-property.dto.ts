import { z } from 'zod';

export const CreatePropertyDtoSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Property address is required'),
  teamId: z.uuid('Team ID must be a valid UUID'),
  alias: z.string().max(10, 'Alias must be 10 characters or less').optional(),
});

export type CreatePropertyDto = z.infer<typeof CreatePropertyDtoSchema>;
