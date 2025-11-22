import { z } from 'zod';
import { BaseSource } from '@modules/split/domain/base-selector.value-object';

export const SplitRuleBaseSchema = z.object({
  mode: z.nativeEnum(BaseSource),
  includeCategoryIds: z.array(z.string().uuid()).optional(),
  excludeCategoryIds: z.array(z.string().uuid()).optional(),
});

export type SplitRuleBase = z.infer<typeof SplitRuleBaseSchema>;

export const CreateSplitRuleDtoSchema = z.object({
  splitPlanId: z.string().uuid('Split plan ID must be a valid UUID'),
  order: z.number().int().positive('Order must be a positive integer'),
  base: SplitRuleBaseSchema,
});

export type CreateSplitRuleDto = z.infer<typeof CreateSplitRuleDtoSchema>;
