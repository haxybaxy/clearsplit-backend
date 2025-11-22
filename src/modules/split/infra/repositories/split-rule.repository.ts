import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBSplitRule } from './model/split-rule.entity';
import { BaseSource } from '@modules/split/domain/base-selector.value-object';
import { v4 as uuidv4 } from 'uuid';

export interface SplitRuleBase {
  mode: BaseSource;
  includeCategoryIds?: string[];
  excludeCategoryIds?: string[];
}

export interface CreateSplitRuleData {
  splitPlanId: string;
  order: number;
  base: SplitRuleBase;
}

@Injectable()
export class SplitRuleRepository {
  constructor(
    @InjectRepository(DBSplitRule)
    private readonly repository: Repository<DBSplitRule>,
  ) {}

  async create(
    data: CreateSplitRuleData,
    entityManager?: EntityManager,
  ): Promise<DBSplitRule> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const splitRule = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(splitRule);
  }

  async createMany(
    dataArray: CreateSplitRuleData[],
    entityManager?: EntityManager,
  ): Promise<DBSplitRule[]> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const rules = dataArray.map((data) =>
      repo.create({
        id: uuidv4(),
        ...data,
      }),
    );

    return repo.save(rules);
  }

  async findById(id: string): Promise<DBSplitRule | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['splitPlan', 'allocations', 'allocations.stakeholder'],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBSplitRule | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findBySplitPlanId(splitPlanId: string): Promise<DBSplitRule[]> {
    return this.repository.find({
      where: { splitPlanId },
      relations: ['allocations', 'allocations.stakeholder'],
      order: { order: 'ASC' },
    });
  }

  async getNextOrder(
    splitPlanId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const result = await repo
      .createQueryBuilder('rule')
      .select('MAX(rule.order)', 'maxOrder')
      .where('rule.splitPlanId = :splitPlanId', { splitPlanId })
      .getRawOne<{ maxOrder: number | null }>();

    return (result?.maxOrder ?? 0) + 1;
  }

  async update(
    id: string,
    updateData: Partial<DBSplitRule>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    await repo.update(id, updateData);
  }

  async reorder(
    splitPlanId: string,
    ruleIds: string[],
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const updatePromises = ruleIds.map((ruleId, index) =>
      repo.update({ id: ruleId, splitPlanId }, { order: index + 1 }),
    );

    await Promise.all(updatePromises);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteBySplitPlanId(
    splitPlanId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitRule)
      : this.repository;

    const result = await repo.delete({ splitPlanId });
    return result.affected ?? 0;
  }
}
