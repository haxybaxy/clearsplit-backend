import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';
import { DBTransaction } from '@modules/transaction/infra/repositories/model/transaction.entity';

export const PROPERTY_TABLE_NAME = 'property';

@Entity(PROPERTY_TABLE_NAME)
export class DBProperty extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  teamId: string;

  @ManyToOne(() => DBTeam, (team) => team.properties, { nullable: false })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: DBTeam;

  @OneToMany(() => DBTransaction, (transaction) => transaction.property)
  transactions: DBTransaction[];
}
