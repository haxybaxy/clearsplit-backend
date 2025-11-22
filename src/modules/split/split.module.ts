import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBSplitPlan } from './infra/repositories/model/split-plan.entity';
import { DBSplitRule } from './infra/repositories/model/split-rule.entity';
import { DBAllocation } from './infra/repositories/model/allocation.entity';
import { DBStakeholder } from './infra/repositories/model/stakeholder.entity';
import { SplitPlanRepository } from './infra/repositories/split-plan.repository';
import { SplitRuleRepository } from './infra/repositories/split-rule.repository';
import { AllocationRepository } from './infra/repositories/allocation.repository';
import { StakeholderRepository } from './infra/repositories/stakeholder.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DBSplitPlan,
      DBSplitRule,
      DBAllocation,
      DBStakeholder,
    ]),
  ],
  providers: [
    SplitPlanRepository,
    SplitRuleRepository,
    AllocationRepository,
    StakeholderRepository,
  ],
  exports: [
    TypeOrmModule,
    SplitPlanRepository,
    SplitRuleRepository,
    AllocationRepository,
    StakeholderRepository,
  ],
})
export class SplitModule {}
