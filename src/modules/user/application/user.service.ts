import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DBUser } from '../infra/repositories/model/user.entity';
import {
  UserRepository,
  CreateUserData,
} from '../infra/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    createUserDto: CreateUserData,
    entityManager?: EntityManager,
  ): Promise<DBUser> {
    return this.userRepository.create(createUserDto, entityManager);
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<DBUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateData: Partial<DBUser>,
    entityManager?: EntityManager,
  ): Promise<DBUser> {
    await this.userRepository.update(id, updateData, entityManager);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
