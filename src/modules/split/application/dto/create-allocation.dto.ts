import { z } from 'zod';
import { AllocationType } from '@modules/split/domain/allocation-type.value-object';

export const CreateAllocationDtoSchema = z.object({
  splitRuleId: z.uuid('Split rule ID must be a valid UUID'),
  stakeholderId: z.uuid('Stakeholder ID must be a valid UUID'),
  type: z.enum(AllocationType),
  value: z.union([z.number(), z.string()]),
  currencyId: z.string().optional(),
});

export type CreateAllocationDto = z.infer<typeof CreateAllocationDtoSchema>;
