import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBTeam } from './model/team.entity';
import { v4 as uuidv4 } from 'uuid';
import type { CreateTeamDto } from '@modules/team/application/dto/create-team.dto';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(DBTeam)
    private readonly repository: Repository<DBTeam>,
  ) {}

  async create(
    data: CreateTeamDto,
    entityManager?: EntityManager,
  ): Promise<DBTeam> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeam)
      : this.repository;

    const team = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(team);
  }

  async findById(teamId: string): Promise<DBTeam | null> {
    return this.repository.findOne({
      where: { id: teamId },
      relations: ['members', 'user', 'currency'],
    });
  }

  async findByIdWithRelations(
    teamId: string,
    relations: string[],
    entityManager?: EntityManager,
  ): Promise<DBTeam | null> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeam)
      : this.repository;

    return repo.findOne({
      where: { id: teamId },
      relations,
    });
  }

  async findTeamsByUserId(userId: string): Promise<DBTeam[]> {
    return this.repository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member')
      .where('member.userId = :userId', { userId })
      .leftJoinAndSelect('team.members', 'allMembers')
      .leftJoinAndSelect('team.currency', 'currency')
      .getMany();
  }

  async update(
    id: string,
    updateData: Partial<DBTeam>,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeam)
      : this.repository;

    await repo.update(id, updateData);
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeam)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
