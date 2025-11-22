import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBProperty } from './model/property.entity';
import { v4 as uuidv4 } from 'uuid';
import type { CreatePropertyDto } from '@modules/property/application/dto/create-property.dto';

@Injectable()
export class PropertyRepository {
  constructor(
    @InjectRepository(DBProperty)
    private readonly repository: Repository<DBProperty>,
  ) {}

  async create(
    data: CreatePropertyDto,
    entityManager?: EntityManager,
  ): Promise<DBProperty> {
    const repo = entityManager
      ? entityManager.getRepository(DBProperty)
      : this.repository;

    const property = repo.create({
      id: uuidv4(),
      alias: data.alias ?? data.name.substring(0, 10).toUpperCase(),
      ...data,
    });

    return repo.save(property);
  }

  async findById(id: string): Promise<DBProperty | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['team', 'splitPlans', 'stakeholders'],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBProperty | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBProperty)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findByTeamId(teamId: string): Promise<DBProperty[]> {
    return this.repository.find({
      where: { teamId },
      relations: ['stakeholders', 'stakeholders.contact'],
      order: { name: 'ASC' },
    });
  }

  async findByTeamIdWithSplitPlans(teamId: string): Promise<DBProperty[]> {
    return this.repository.find({
      where: { teamId },
      relations: ['splitPlans', 'splitPlans.splitRules'],
      order: { name: 'ASC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<DBProperty>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBProperty)
      : this.repository;

    await repo.update(id, updateData);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBProperty)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
