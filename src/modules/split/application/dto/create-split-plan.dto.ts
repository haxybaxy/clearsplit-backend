import { z } from 'zod';

export const CreateSplitPlanDtoSchema = z.object({
  name: z.string().min(1, 'Split plan name is required'),
  propertyId: z.uuid('Property ID must be a valid UUID'),
  isActive: z.boolean().optional().default(true),
  expirationDate: z.coerce.date().optional(),
});

export type CreateSplitPlanDto = z.infer<typeof CreateSplitPlanDtoSchema>;
