import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBContact } from './infra/repositories/model/contact.entity';
import { ContactRepository } from './infra/repositories/contact.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DBContact])],
  providers: [ContactRepository],
  exports: [TypeOrmModule, ContactRepository],
})
export class ContactModule {}
