import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';

@Entity()
export class DBTeam extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @OneToOne(() => DBUser)
  @JoinColumn()
  ownerId: string;

  @Column({ nullable: false })
  defaultCurrency: string;
}
