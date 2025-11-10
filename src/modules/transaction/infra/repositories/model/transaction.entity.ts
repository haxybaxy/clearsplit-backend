import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity } from 'typeorm';

export const TRANSACTION_TABLE_NAME = 'transaction';

@Entity(TRANSACTION_TABLE_NAME)
export class DBTransaction extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column({ nullable: false })
  address: string;
}
