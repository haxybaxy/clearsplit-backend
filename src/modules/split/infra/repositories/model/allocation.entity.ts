import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DBStakeholder } from './stakeholder.entity';
import { DBSplitRule } from './split-rule.entity';
import { AllocationType } from '@modules/split/domain/allocation-type.value-object';
import { DBCurrency } from '@modules/currency/infra/repositories/model/currency.entity';

export const ALLOCATION_TABLE_NAME = 'allocation';

@Entity(ALLOCATION_TABLE_NAME)
export class DBAllocation extends DatabaseEntity {
  @Column({ nullable: false })
  splitRuleId: string;

  @ManyToOne(() => DBSplitRule, (splitRule) => splitRule.allocations)
  @JoinColumn({ name: 'splitRule', referencedColumnName: 'id' })
  splitRule: DBSplitRule;

  @Column({ nullable: false })
  stakeholderId: string;

  @ManyToOne(() => DBStakeholder, (stakeholder) => stakeholder.allocations)
  @JoinColumn({ name: 'stakeholderId', referencedColumnName: 'id' })
  stakeholder: DBStakeholder;

  @Column({
    type: 'enum',
    enum: AllocationType,
    default: AllocationType.Percent,
  })
  type: string;

  @Column({ type: 'jsonb' })
  value: number | string;

  @Column({ nullable: true })
  currencyId?: string;

  @ManyToOne(() => DBCurrency, (currency) => currency.allocations)
  @JoinColumn({ name: 'currencyId', referencedColumnName: 'id' })
  currency?: DBCurrency;
}
