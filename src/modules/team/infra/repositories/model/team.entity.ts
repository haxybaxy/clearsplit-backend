import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { DBTeamMember } from './team-member.entity';
import { DBCurrency } from '@modules/currency/infra/repositories/model/currency.entity';

export const TEAM_TABLE_NAME = 'team';

@Entity(TEAM_TABLE_NAME)
export class DBTeam extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  ownerId: string;

  @OneToOne(() => DBUser, (user) => user.owner, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  user: DBUser;

  @Column({ nullable: false, default: 'EUR' })
  defaultCurrencyId: string;

  @ManyToOne(() => DBCurrency, (currency) => currency.teams)
  @JoinColumn({ name: 'defaultCurrencyId', referencedColumnName: 'code' })
  currency: DBCurrency;

  @OneToMany(() => DBProperty, (property) => property.team)
  properties: DBProperty[];

  @OneToMany(() => DBTeamMember, (teamMember) => teamMember.team)
  members: DBTeamMember[];
}
