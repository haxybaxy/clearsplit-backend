import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SplitLayerType } from '@modules/split/domain/split-layer-type.value-object';
import { SplitLayerKind } from '@modules/split/domain/split-layer-kind.value-object';
import { DBCurrency } from '@modules/currency/infra/repositories/model/currency.entity';

export const SPLIT_LAYER_TABLE_NAME = 'split_layer';
@Entity(SPLIT_LAYER_TABLE_NAME)
export class DBSplitLayer extends DatabaseEntity {
  @Column({ nullable: false })
  order: number;

  @Column({
    type: 'enum',
    enum: SplitLayerKind,
    nullable: false,
    default: SplitLayerKind.Profit,
  })
  kind: string;

  @Column({
    type: 'enum',
    enum: SplitLayerType,
    nullable: false,
    default: SplitLayerType.Percentage,
  })
  type: string;

  @Column({ nullable: true })
  currencyId?: string;

  @ManyToOne(() => DBCurrency, (currency) => currency.splitLayers)
  @JoinColumn({ name: 'currencyId', referencedColumnName: 'id' })
  currency: DBCurrency;
}
