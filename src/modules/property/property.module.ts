import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBProperty } from './infra/repositories/model/property.entity';
import { PropertyRepository } from './infra/repositories/property.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DBProperty])],
  providers: [PropertyRepository],
  exports: [TypeOrmModule, PropertyRepository],
})
export class PropertyModule {}
