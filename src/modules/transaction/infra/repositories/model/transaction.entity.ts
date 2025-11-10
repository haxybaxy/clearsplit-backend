import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { TransactionType } from '@modules/transaction/domain/transaction-type.value-object';
import { DBCurrency } from '@modules/currency/infra/repositories/model/invoice-form.entity';

export const TRANSACTION_TABLE_NAME = 'transaction';

@Entity(TRANSACTION_TABLE_NAME)
export class DBTransaction extends DatabaseEntity {
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
    default: TransactionType.Income,
  })
  @Column({ nullable: false })
  finalAmount: number;

  @Column({ nullable: false })
  originalAmount: number;

  @Column({ nullable: false })
  finalCurrencyId: string;

  @ManyToOne(() => DBCurrency, (currency) => currency.finalCurrencyTransactions)
  @JoinColumn({ name: 'finalCurrencyId', referencedColumnName: 'id' })
  finalCurrency: DBCurrency;

  @Column({ nullable: false })
  originalCurrencyId: string;

  @ManyToOne(
    () => DBCurrency,
    (currency) => currency.originalCurrencyTransactions,
  )
  @JoinColumn({ name: 'originalCurrencyId', referencedColumnName: 'id' })
  originalCurrency: DBCurrency;

  @Column({ nullable: false, default: 0 })
  exchangeRate: number;

  @Column({ nullable: false })
  propertyId: string;

  @ManyToOne(() => DBProperty, (property) => property.transactions)
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: DBProperty;
}
