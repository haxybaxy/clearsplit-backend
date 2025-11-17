import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { DBSplitRule } from './split-rule.entity';

export const SPLIT_PLAN_TABLE_NAME = 'split_plan';
@Entity(SPLIT_PLAN_TABLE_NAME)
export class DBSplitPlan extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  isActive: boolean;

  @Column({ nullable: true })
  expirationDate?: Date;

  @Column({ nullable: false })
  propertyId: string;

  @ManyToOne(() => DBProperty, (property) => property.splitPlans)
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: DBProperty;

  @OneToMany(() => DBSplitRule, (splitRule) => splitRule.splitPlan)
  splitRules: DBSplitRule[];
}
