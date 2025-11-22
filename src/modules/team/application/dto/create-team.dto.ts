import { z } from 'zod';

export const CreateTeamDtoSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  ownerId: z.string().uuid('Owner ID must be a valid UUID'),
  defaultCurrencyId: z.string().min(1, 'Default currency is required'),
});

export type CreateTeamDto = z.infer<typeof CreateTeamDtoSchema>;
