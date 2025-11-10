import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';

@Entity()
export class DBProperty extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  teamId: string;

  @ManyToOne(() => DBTeam, { nullable: false })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: DBTeam;
}
