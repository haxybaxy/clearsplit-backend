import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBContact } from './infra/repositories/model/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DBContact])],
  exports: [TypeOrmModule],
})
export class ContactModule {}
