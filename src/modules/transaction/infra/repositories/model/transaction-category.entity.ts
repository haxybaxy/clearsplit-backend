import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DBTransaction } from './transaction.entity';
import { DBTransactionComponent } from './transaction-component.entity';
import { DBTeam } from '@modules/team/infra/repositories/model/team.entity';

export const TRANSACTION_CATEGORY_TABLE_NAME = 'transaction_category';

@Entity(TRANSACTION_CATEGORY_TABLE_NAME)
export class DBTransactionCategory extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: true })
  custom: boolean;

  @Column({ nullable: true })
  teamId: string | null;

  @ManyToOne(() => DBTeam, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: DBTeam | null;

  @OneToMany(() => DBTransaction, (transaction) => transaction.category)
  transactions: DBTransaction[];

  @OneToMany(
    () => DBTransactionComponent,
    (transaction) => transaction.category,
  )
  transactionComponents: DBTransactionComponent[];
}
