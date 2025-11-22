import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBUser } from '../infra/repositories/model/user.entity';

export interface CreateUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(DBUser)
    private readonly userRepository: Repository<DBUser>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    entityManager?: EntityManager,
  ): Promise<DBUser> {
    const userRepo = entityManager
      ? entityManager.getRepository(DBUser)
      : this.userRepository;

    const user = userRepo.create(createUserDto);
    return await userRepo.save(user);
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<DBUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateData: Partial<DBUser>): Promise<DBUser> {
    await this.userRepository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
