import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SplitLayerType } from '@modules/split/domain/split-layer-type.value-object'

export const SPLIT_LAYER_TABLE_NAME = 'split_layer';
@Entity(SPLIT_LAYER_TABLE_NAME)
export class DBSplitLayer extends DatabaseEntity {
  @Column({ nullable: false })
  order: number;

  @Column({
    type: 'enum',
    enum: SplitLayerType,
    nullable: false,
    default: SplitLayerType.Percentage
  })
  type: string;


  //TODO: type and currency and base


}
