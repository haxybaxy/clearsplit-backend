import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export const SPLIT_LAYER_TABLE_NAME = 'split_plan';
@Entity(SPLIT_LAYER_TABLE_NAME)
export class DBSplitLayer extends DatabaseEntity {
  @Column({ nullable: false })
  order: number;

  @Column({ nullable: false })
  //TODO: type and currency and base


}
