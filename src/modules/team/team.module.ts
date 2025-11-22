import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBTeam } from './infra/repositories/model/team.entity';
import { DBTeamMember } from './infra/repositories/model/team-member.entity';
import { TeamRepository } from './infra/repositories/team.repository';
import { TeamMemberRepository } from './infra/repositories/team-member.repository';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([DBTeam, DBTeamMember])],
  providers: [TeamRepository, TeamMemberRepository, TeamService],
  exports: [TeamService, TeamRepository, TeamMemberRepository],
})
export class TeamModule {}
