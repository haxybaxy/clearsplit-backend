import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DBTeam } from '../infra/repositories/model/team.entity';
import { TeamRepository } from '../infra/repositories/team.repository';
import { TeamMemberRepository } from '../infra/repositories/team-member.repository';
import { TeamMemberRole } from '../domain/team-member-role.value-object';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
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
    // Create the team
    const savedTeam = await this.teamRepository.create(
      {
        name: teamName,
        ownerId: userId,
        defaultCurrencyId,
      },
      entityManager,
    );

    // Create team membership with owner role
    await this.teamMemberRepository.create(
      {
        teamId: savedTeam.id,
        userId,
        role: TeamMemberRole.Owner,
      },
      entityManager,
    );

    // Return team with members relation loaded
    return this.teamRepository.findByIdWithRelations(
      savedTeam.id,
      ['members', 'user'],
      entityManager,
    );
  }

  /**
   * Finds a team by ID
   * @param teamId - Team ID
   * @returns Team or null if not found
   */
  async findById(teamId: string): Promise<DBTeam | null> {
    return this.teamRepository.findById(teamId);
  }

  /**
   * Finds all teams where user is a member
   * @param userId - User ID
   * @returns Array of teams
   */
  async findTeamsByUserId(userId: string): Promise<DBTeam[]> {
    return this.teamRepository.findTeamsByUserId(userId);
  }
}
