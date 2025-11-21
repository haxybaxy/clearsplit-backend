import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBCurrency } from './infra/repositories/model/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DBCurrency])],
  exports: [TypeOrmModule],
})
export class CurrencyModule {}
