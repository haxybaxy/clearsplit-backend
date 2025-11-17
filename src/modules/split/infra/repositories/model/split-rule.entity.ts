import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DBSplitPlan } from './split-plan.entity';
import { BaseSource } from '@modules/split/domain/base-selector.value-object';

export const SPLIT_RULE_TABLE_NAME = 'split_rule';
@Entity(SPLIT_RULE_TABLE_NAME)
export class DBSplitRule extends DatabaseEntity {
  @Column({ nullable: false })
  order: number;

  @Column({ type: 'jsonb' })
  base: {
    mode: BaseSource;
    includeCategoryIds?: string[];
    excludeCategoryIds?: string[];
  };

  @Column({ nullable: false })
  splitPlanId: string;

  @ManyToOne(() => DBSplitPlan, (splitPlan) => splitPlan.splitRules)
  @JoinColumn({ name: 'splitPlanId', referencedColumnName: 'id' })
  splitPlan: DBSplitPlan;
}
