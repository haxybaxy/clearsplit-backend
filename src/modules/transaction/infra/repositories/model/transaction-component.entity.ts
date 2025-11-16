import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionComponentCategory } from '@modules/transaction/domain/transaction-component-category.value-object';
import { DBCurrency } from '@modules/currency/infra/repositories/model/invoice-form.entity';
import { DBTransaction } from './transaction.entity';

export const TRANSACTION_COMPONENT_TABLE_NAME = 'transaction_component';

@Entity(TRANSACTION_COMPONENT_TABLE_NAME)
export class DBTransactionComponent extends DatabaseEntity {
  @Column({
    type: 'enum',
    enum: TransactionComponentCategory,
    nullable: false,
    default: TransactionComponentCategory.Rent,
  })
  category: string;

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

  @ManyToOne(() => DBCurrency, (currency) => currency.finalCurrencyTransactions)
  @JoinColumn({ name: 'finalCurrencyId', referencedColumnName: 'id' })
  finalCurrency: DBCurrency;

  @Column({ nullable: true })
  originalCurrencyId?: string;

  @ManyToOne(
    () => DBCurrency,
    (currency) => currency.originalCurrencyTransactions,
  )
  @JoinColumn({ name: 'originalCurrencyId', referencedColumnName: 'id' })
  originalCurrency: DBCurrency;
}
