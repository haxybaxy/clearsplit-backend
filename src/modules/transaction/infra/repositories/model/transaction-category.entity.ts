import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { TransactionCategoryType } from '@modules/transaction/domain/transaction-category-type.value-object';
import { Column, Entity, OneToMany } from 'typeorm';
import { DBTransaction } from './transaction.entity';
import { DBTransactionComponent } from './transaction-component.entity';

export const TRANSACTION_CATEGORY_TABLE_NAME = 'transaction_category';

@Entity(TRANSACTION_CATEGORY_TABLE_NAME)
export class DBTransactionCategory extends DatabaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: TransactionCategoryType,
    nullable: false,
    default: TransactionCategoryType.Custom,
  })
  category: string;

  @OneToMany(() => DBTransaction, (transaction) => transaction.category)
  transactions: DBTransaction[];

  @OneToMany(
    () => DBTransactionComponent,
    (transaction) => transaction.category,
  )
  transactionComponents: DBTransactionComponent[];
}
