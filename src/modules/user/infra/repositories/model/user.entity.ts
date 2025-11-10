import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, OneToMany, JoinColumn } from 'typeorm';
import { DBTeamMember } from '@modules/team/infra/repositories/model/team-member.entity';

export const USER_TABLE_NAME = 'user';

@Entity(USER_TABLE_NAME)
export class DBUser extends DatabaseEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => DBTeamMember, (teamMembership) => teamMembership.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  teamMembership: DBTeamMember[];
}
