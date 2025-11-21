import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBTeam } from './infra/repositories/model/team.entity';
import { DBTeamMember } from './infra/repositories/model/team-member.entity';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([DBTeam, DBTeamMember])],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
