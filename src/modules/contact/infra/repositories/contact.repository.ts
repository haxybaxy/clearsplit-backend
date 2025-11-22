import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBContact } from './model/contact.entity';
import { v4 as uuidv4 } from 'uuid';
import type { CreateContactDto } from '@modules/contact/application/dto/create-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(DBContact)
    private readonly repository: Repository<DBContact>,
  ) {}

  async create(
    data: CreateContactDto,
    entityManager?: EntityManager,
  ): Promise<DBContact> {
    const repo = entityManager
      ? entityManager.getRepository(DBContact)
      : this.repository;

    const contact = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(contact);
  }

  async findById(id: string): Promise<DBContact | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['team', 'user', 'stakeholders'],
    });
  }

  async findByIdWithRelations(
    id: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBContact | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBContact)
      : this.repository;

    return repo.findOne({
      where: { id },
      relations,
    });
  }

  async findByTeamId(teamId: string): Promise<DBContact[]> {
    return this.repository.find({
      where: { teamId },
      relations: ['user'],
      order: { name: 'ASC' },
    });
  }

  async findByEmail(email: string, teamId: string): Promise<DBContact | null> {
    return this.repository.findOne({
      where: { email, teamId },
    });
  }

  async update(
    id: string,
    updateData: Partial<DBContact>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBContact)
      : this.repository;

    await repo.update(id, updateData);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBContact)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
