import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBSplitPlan } from './model/split-plan.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateSplitPlanData {
  name: string;
  propertyId: string;
  isActive?: boolean;
  expirationDate?: Date;
}

@Injectable()
export class SplitPlanRepository {
  constructor(
    @InjectRepository(DBSplitPlan)
    private readonly repository: Repository<DBSplitPlan>,
  ) {}

  async create(
    data: CreateSplitPlanData,
    entityManager?: EntityManager,
  ): Promise<DBSplitPlan> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitPlan)
      : this.repository;

    const splitPlan = repo.create({
      id: uuidv4(),
      isActive: data.isActive ?? true,
      ...data,
    });

    return repo.save(splitPlan);
  }

  async findById(id: string): Promise<DBSplitPlan | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['property', 'splitRules', 'splitRules.allocations'],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBSplitPlan | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitPlan)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findByPropertyId(propertyId: string): Promise<DBSplitPlan[]> {
    return this.repository.find({
      where: { propertyId },
      relations: ['splitRules'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByPropertyId(
    propertyId: string,
  ): Promise<DBSplitPlan | null> {
    return this.repository.findOne({
      where: { propertyId, isActive: true },
      relations: [
        'splitRules',
        'splitRules.allocations',
        'splitRules.allocations.stakeholder',
      ],
    });
  }

  async update(
    id: string,
    updateData: Partial<DBSplitPlan>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitPlan)
      : this.repository;

    await repo.update(id, updateData);
  }

  async deactivateAllForProperty(
    propertyId: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitPlan)
      : this.repository;

    await repo.update({ propertyId }, { isActive: false });
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBSplitPlan)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
