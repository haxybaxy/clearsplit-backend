import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBTeamMember } from './model/team-member.entity';
import { TeamMemberRole } from '@modules/team/domain/team-member-role.value-object';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTeamMemberData {
  teamId: string;
  userId: string;
  role: TeamMemberRole;
}

@Injectable()
export class TeamMemberRepository {
  constructor(
    @InjectRepository(DBTeamMember)
    private readonly repository: Repository<DBTeamMember>,
  ) {}

  async create(
    data: CreateTeamMemberData,
    entityManager?: EntityManager,
  ): Promise<DBTeamMember> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeamMember)
      : this.repository;

    const teamMember = repo.create({
      id: uuidv4(),
      ...data,
    });

    return repo.save(teamMember);
  }

  async findByTeamAndUser(
    teamId: string,
    userId: string,
  ): Promise<DBTeamMember | null> {
    return this.repository.findOne({
      where: { teamId, userId },
    });
  }

  async findByTeamId(teamId: string): Promise<DBTeamMember[]> {
    return this.repository.find({
      where: { teamId },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<DBTeamMember[]> {
    return this.repository.find({
      where: { userId },
      relations: ['team'],
    });
  }

  async updateRole(
    id: string,
    role: TeamMemberRole,
    entityManager?: EntityManager,
  ): Promise<void> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeamMember)
      : this.repository;

    await repo.update(id, { role });
  }

  async delete(id: string, entityManager?: EntityManager): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeamMember)
      : this.repository;

    const result = await repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async deleteByTeamAndUser(
    teamId: string,
    userId: string,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    const repo = entityManager
      ? entityManager.getRepository(DBTeamMember)
      : this.repository;

    const result = await repo.delete({ teamId, userId });
    return (result.affected ?? 0) > 0;
  }
}
