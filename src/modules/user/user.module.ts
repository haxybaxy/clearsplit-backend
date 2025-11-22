import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBUser } from './infra/repositories/model/user.entity';
import { UserRepository } from './infra/repositories/user.repository';
import { UserService } from './application/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([DBUser])],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
