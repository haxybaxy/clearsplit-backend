import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { TransactionType } from '@modules/transaction/domain/transaction-type.value-object';

export const TRANSACTION_TABLE_NAME = 'transaction';

@Entity(TRANSACTION_TABLE_NAME)
export class DBTransaction extends DatabaseEntity {
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
    default: TransactionType.Income,
  })
  @Column({ nullable: false })
  propertyId: string;

  @ManyToOne(() => DBProperty, (property) => property.transactions)
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: DBProperty;
}
