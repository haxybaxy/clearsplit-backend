import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBTransaction } from './infra/repositories/model/transaction.entity';
import { DBTransactionComponent } from './infra/repositories/model/transaction-component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DBTransaction, DBTransactionComponent])],
  exports: [TypeOrmModule],
})
export class TransactionModule {}
