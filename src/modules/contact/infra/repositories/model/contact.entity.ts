import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { DBUser } from '@modules/user/infra/repositories/model/user.entity';

@Entity()
export class DBContact extends DatabaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  notes: string;

  @OneToOne(() => DBUser, (user) => user.contact, { nullable: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: DBUser;
}
