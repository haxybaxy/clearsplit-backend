import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { TransactionType } from '@modules/transaction/domain/transaction-type.value-object';
import { DBCurrency } from '@modules/currency/infra/repositories/model/currency.entity';
import { DBContact } from '@modules/contact/infra/repositories/model/contact.entity';
import { DBTransactionComponent } from './transaction-component.entity';

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

  @OneToMany(
    () => DBTransactionComponent,
    (transactionComponent) => transactionComponent.transaction,
  )
  components: DBTransactionComponent[];

  @Column({ nullable: false, default: 0 })
  exchangeRate: number;

  @Column({ nullable: false })
  propertyId: string;

  @ManyToOne(() => DBProperty, (property) => property.transactions)
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: DBProperty;

  @Column({ nullable: true })
  contactId: number;

  @ManyToOne(() => DBContact, (contact) => contact.transactions)
  @JoinColumn({ name: 'contactId', referencedColumnName: 'id' })
  contact: DBContact;
}
