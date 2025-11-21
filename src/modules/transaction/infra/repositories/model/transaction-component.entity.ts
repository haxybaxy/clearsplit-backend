import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DBTransactionCategory } from './transaction-category.entity';
import { DBCurrency } from '@modules/currency/infra/repositories/model/currency.entity';
import { DBTransaction } from './transaction.entity';

export const TRANSACTION_COMPONENT_TABLE_NAME = 'transaction_component';

@Entity(TRANSACTION_COMPONENT_TABLE_NAME)
export class DBTransactionComponent extends DatabaseEntity {
  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(
    () => DBTransactionCategory,
    (category) => category.transactionComponents,
  )
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: DBTransactionCategory;

  @Column({ nullable: false })
  finalAmount: number;

  @Column({ nullable: false })
  originalAmount: number;

  @Column({ nullable: false })
  transactionId: string;

  @ManyToOne(() => DBTransaction, (transaction) => transaction.components)
  @JoinColumn({ name: 'transactionId', referencedColumnName: 'id' })
  transaction: DBTransaction;

  @Column({ nullable: true })
  finalCurrencyId?: string;

  @ManyToOne(
    () => DBCurrency,
    (currency) => currency.finalCurrencyTransactionComponents,
  )
  @JoinColumn({ name: 'finalCurrencyId', referencedColumnName: 'code' })
  finalCurrency: DBCurrency;

  @Column({ nullable: true })
  originalCurrencyId?: string;

  @ManyToOne(
    () => DBCurrency,
    (currency) => currency.originalCurrencyTransactionComponents,
  )
  @JoinColumn({ name: 'originalCurrencyId', referencedColumnName: 'code' })
  originalCurrency: DBCurrency;
}
