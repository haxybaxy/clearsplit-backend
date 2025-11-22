import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBStakeholder } from './model/stakeholder.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateStakeholderData {
  contactId: string;
  propertyId: string;
}

@Injectable()
export class StakeholderRepository {
  constructor(
    @InjectRepository(DBStakeholder)
    private readonly repository: Repository<DBStakeholder>,
  ) {}

  async create(
    data: CreateStakeholderData,
    entityManager?: EntityManager,
  ): Promise<DBStakeholder> {
    const repo = entityManager
      ? entityManager.getRepository(DBStakeholder)
      : this.repository;

    const stakeholder = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(stakeholder);
  }

  async createMany(
    dataArray: CreateStakeholderData[],
    entityManager?: EntityManager,
  ): Promise<DBStakeholder[]> {
    const repo = entityManager
      ? entityManager.getRepository(DBStakeholder)
      : this.repository;

    const stakeholders = dataArray.map((data) =>
      repo.create({
        id: uuidv4(),
        ...data,
      }),
    );

    return repo.save(stakeholders);
  }

  async findById(id: string): Promise<DBStakeholder | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['contact', 'property', 'allocations'],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBStakeholder | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBStakeholder)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findByPropertyId(propertyId: string): Promise<DBStakeholder[]> {
    return this.repository.find({
      where: { propertyId },
      relations: ['contact'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByContactId(contactId: string): Promise<DBStakeholder[]> {
    return this.repository.find({
      where: { contactId },
      relations: ['property'],
    });
  }

  async findByPropertyAndContact(
    propertyId: string,
    contactId: string,
  ): Promise<DBStakeholder | null> {
    return this.repository.findOne({
      where: { propertyId, contactId },
    });
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBStakeholder)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteByPropertyId(
    propertyId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const repo = entityManager
      ? entityManager.getRepository(DBStakeholder)
      : this.repository;

    const result = await repo.delete({ propertyId });
    return result.affected ?? 0;
  }
}
