import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { Entity, Column } from 'typeorm';

export const STAKEHOLDER_TABLE_NAME = 'stakeholder';
@Entity(STAKEHOLDER_TABLE_NAME)
export class DBStakeholder extends DatabaseEntity {

  @Column
}
