import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class DBProperty extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column({ nullable: false })
  address: string;
}
