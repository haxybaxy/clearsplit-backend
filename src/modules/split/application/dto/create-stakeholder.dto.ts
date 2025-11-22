import { z } from 'zod';

export const CreateStakeholderDtoSchema = z.object({
  contactId: z.uuid('Contact ID must be a valid UUID'),
  propertyId: z.uuid('Property ID must be a valid UUID'),
});

export type CreateStakeholderDto = z.infer<typeof CreateStakeholderDtoSchema>;
