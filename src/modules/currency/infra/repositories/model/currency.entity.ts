import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { DBTransaction } from '@modules/transaction/infra/repositories/model/transaction.entity';
import { DBTransactionComponent } from '@modules/transaction/infra/repositories/model/transaction-component.entity';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';

export const CURRENCY_TABLE_NAME = 'currency';

@Entity(CURRENCY_TABLE_NAME)
export class DBCurrency extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: string;

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
}
