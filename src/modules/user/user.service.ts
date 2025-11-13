import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DBUser } from './infra/repositories/model/user.entity';

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  supabaseId: string;
  avatarUrl?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(DBUser)
    private readonly userRepository: Repository<DBUser>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<DBUser> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<DBUser | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findBySupabaseId(supabaseId: string): Promise<DBUser | null> {
    return await this.userRepository.findOne({ where: { supabaseId } });
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
