import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DBTransaction } from '@modules/transaction/infra/repositories/model/transaction.entity';
import { DBTransactionComponent } from '@modules/transaction/infra/repositories/model/transaction-component.entity';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';
import { DBAllocation } from '@modules/split/infra/repositories/model/allocation.entity';

export const CURRENCY_TABLE_NAME = 'currency';

/**
 * Currency entity using ISO 4217 currency code as primary key.
 * Does not extend DatabaseEntity as it uses code (e.g., 'EUR', 'USD') instead of UUID.
 */
@Entity(CURRENCY_TABLE_NAME)
export class DBCurrency {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  code: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: false })
  symbol: string;

  @Column({ nullable: false })
  rateFromBase: number;

  @OneToMany(() => DBTransaction, (transaction) => transaction.originalCurrency)
  originalCurrencyTransactions: DBTransaction[];

  @OneToMany(() => DBTransaction, (transaction) => transaction.finalCurrency)
  finalCurrencyTransactions: DBTransaction[];

  @OneToMany(
    () => DBTransactionComponent,
    (transactionComponent) => transactionComponent.finalCurrency,
  )
  finalCurrencyTransactionComponents: DBTransactionComponent[];

  @OneToMany(
    () => DBTransactionComponent,
    (transactionComponent) => transactionComponent.originalCurrency,
  )
  originalCurrencyTransactionComponents: DBTransactionComponent[];

  @OneToMany(() => DBTeam, (team) => team.currency)
  teams: DBTeam[];

  @OneToMany(() => DBAllocation, (allocation) => allocation.currency)
  allocations: DBAllocation[];
}
