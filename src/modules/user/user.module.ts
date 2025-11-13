import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBUser } from './infra/repositories/model/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([DBUser])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
