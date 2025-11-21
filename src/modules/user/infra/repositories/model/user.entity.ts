import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { DBTeamMember } from '@modules/team/infra/repositories/model/team-member.entity';
import { DBContact } from '@modules/contact/infra/repositories/model/contact.entity';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';

export const USER_TABLE_NAME = 'user';

@Entity(USER_TABLE_NAME)
export class DBUser extends DatabaseEntity {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToMany(() => DBTeamMember, (teamMembership) => teamMembership.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  teamMembership: DBTeamMember[];

  @OneToOne(() => DBContact, (contact) => contact.user)
  contact: DBContact;

  @OneToOne(() => DBTeam, (owner) => owner.user)
  owner: DBTeam;
}
