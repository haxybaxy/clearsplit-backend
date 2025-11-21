import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBProperty } from './infra/repositories/model/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DBProperty])],
  exports: [TypeOrmModule],
})
export class PropertyModule {}
