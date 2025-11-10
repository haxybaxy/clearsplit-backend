import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DBTeam } from './team.entity';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';
import { TeamMemberRole } from '@modules/team/domain/team-member-role.value-object';

export const TEAM_MEMBER_TABLE_NAME = 'team_member';
@Entity(TEAM_MEMBER_TABLE_NAME)
export class DBTeamMember extends DatabaseEntity {
  @Column({ nullable: false })
  teamId: string;

  @ManyToOne(() => DBTeam, (team) => team.members, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: DBTeam;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => DBUser, (user) => user.teamMembership, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: DBUser;

  @Column({
    type: 'enum',
    enum: TeamMemberRole,
    nullable: false,
    default: TeamMemberRole.Member,
  })
  role: TeamMemberRole;
}
