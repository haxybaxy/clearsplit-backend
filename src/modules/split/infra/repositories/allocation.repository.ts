import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBAllocation } from './model/allocation.entity';
import { AllocationType } from '@modules/split/domain/allocation-type.value-object';
import { v4 as uuidv4 } from 'uuid';

export interface CreateAllocationData {
  splitRuleId: string;
  stakeholderId: string;
  type: AllocationType;
  value: number | string;
  currencyId?: string;
}

@Injectable()
export class AllocationRepository {
  constructor(
    @InjectRepository(DBAllocation)
    private readonly repository: Repository<DBAllocation>,
  ) {}

  async create(
    data: CreateAllocationData,
    entityManager?: EntityManager,
  ): Promise<DBAllocation> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    const allocation = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(allocation);
  }

  async createMany(
    dataArray: CreateAllocationData[],
    entityManager?: EntityManager,
  ): Promise<DBAllocation[]> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    const allocations = dataArray.map((data) =>
      repo.create({
        id: uuidv4(),
        ...data,
      }),
    );

    return repo.save(allocations);
  }

  async findById(id: string): Promise<DBAllocation | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        'splitRule',
        'stakeholder',
        'stakeholder.contact',
        'currency',
      ],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBAllocation | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findBySplitRuleId(splitRuleId: string): Promise<DBAllocation[]> {
    return this.repository.find({
      where: { splitRuleId },
      relations: ['stakeholder', 'stakeholder.contact', 'currency'],
    });
  }

  async findByStakeholderId(stakeholderId: string): Promise<DBAllocation[]> {
    return this.repository.find({
      where: { stakeholderId },
      relations: ['splitRule', 'splitRule.splitPlan'],
    });
  }

  async update(
    id: string,
    updateData: Partial<DBAllocation>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    await repo.update(id, updateData);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteByRuleId(
    splitRuleId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    const result = await repo.delete({ splitRuleId });
    return result.affected ?? 0;
  }

  async deleteByStakeholderId(
    stakeholderId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = entityManager
      ? entityManager.getRepository(DBAllocation)
      : this.repository;

    const result = await repo.delete({ stakeholderId });
    return result.affected ?? 0;
  }
}
