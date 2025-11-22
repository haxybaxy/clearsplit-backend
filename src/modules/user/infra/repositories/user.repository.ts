import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBUser } from './model/user.entity';

export interface CreateUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(DBUser)
    private readonly repository: Repository<DBUser>,
  ) {}

  async create(
    data: CreateUserData,
    entityManager?: EntityManager,
  ): Promise<DBUser> {
    const repo = entityManager
      ? entityManager.getRepository(DBUser)
      : this.repository;

    const user = repo.create(data);
    return repo.save(user);
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<DBUser | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateData: Partial<DBUser>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBUser)
      : this.repository;

    await repo.update(id, updateData);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBUser)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
