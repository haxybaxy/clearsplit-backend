import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { DBTeam } from './infra/repositories/model/team.entity';
import { DBTeamMember } from './infra/repositories/model/team-member.entity';
import { TeamMemberRole } from './domain/team-member-role.value-object';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(DBTeam)
    private readonly teamRepository: Repository<DBTeam>,
    @InjectRepository(DBTeamMember)
    private readonly teamMemberRepository: Repository<DBTeamMember>,
  ) {}

  /**
   * Creates a team with the specified owner
   * @param userId - ID of the user who will own the team
   * @param teamName - Name of the team
   * @param defaultCurrencyId - Default currency for the team
   * @param entityManager - Optional EntityManager for transaction support
   * @returns Created team with relations
   */
  async createTeamWithOwner(
    userId: string,
    teamName: string,
    defaultCurrencyId: string,
    entityManager?: EntityManager,
  ): Promise<DBTeam> {
    const teamRepo = entityManager
      ? entityManager.getRepository(DBTeam)
      : this.teamRepository;
    const teamMemberRepo = entityManager
      ? entityManager.getRepository(DBTeamMember)
      : this.teamMemberRepository;

    // Create the team
    const team = teamRepo.create({
      id: uuidv4(),
      name: teamName,
      ownerId: userId,
      defaultCurrencyId,
    });

    const savedTeam = await teamRepo.save(team);

    // Create team membership with owner role
    const teamMember = teamMemberRepo.create({
      id: uuidv4(),
      teamId: savedTeam.id,
      userId,
      role: TeamMemberRole.Owner,
    });

    await teamMemberRepo.save(teamMember);

    // Return team with members relation loaded
    return teamRepo.findOne({
      where: { id: savedTeam.id },
      relations: ['members', 'user'],
    });
  }

  /**
   * Finds a team by ID
   * @param teamId - Team ID
   * @returns Team or null if not found
   */
  async findById(teamId: string): Promise<DBTeam | null> {
    return this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['members', 'user', 'currency'],
    });
  }

  /**
   * Finds all teams where user is a member
   * @param userId - User ID
   * @returns Array of teams
   */
  async findTeamsByUserId(userId: string): Promise<DBTeam[]> {
    return this.teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member')
      .where('member.userId = :userId', { userId })
      .leftJoinAndSelect('team.members', 'allMembers')
      .leftJoinAndSelect('team.currency', 'currency')
      .getMany();
  }
}
