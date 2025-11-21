import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity } from 'typeorm';

export const TRANSACTION_CATEGORY_TABLE_NAME = 'transaction_category';

@Entity(TRANSACTION_CATEGORY_TABLE_NAME)
export class DBTransactionCategory extends DatabaseEntity {
  @Column({ nullable: true })
  name: string;
}
