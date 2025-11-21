import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBSplitPlan } from './infra/repositories/model/split-plan.entity';
import { DBSplitRule } from './infra/repositories/model/split-rule.entity';
import { DBAllocation } from './infra/repositories/model/allocation.entity';
import { DBStakeholder } from './infra/repositories/model/stakeholder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DBSplitPlan,
      DBSplitRule,
      DBAllocation,
      DBStakeholder,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class SplitModule {}
