import { DatabaseEntity } from '@base/infra/repositories/entities/typeorm/database.entity';
import { DBContact } from '@modules/contact/infra/repositories/model/contact.entity';
import { DBProperty } from '@modules/property/infra/repositories/model/property.entity';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DBAllocation } from './allocation.entity';

export const STAKEHOLDER_TABLE_NAME = 'stakeholder';
@Entity(STAKEHOLDER_TABLE_NAME)
export class DBStakeholder extends DatabaseEntity {
  @Column({ nullable: false })
  contactId: string;

  @ManyToOne(() => DBContact, (contact) => contact.stakeholders)
  @JoinColumn({ name: 'contactId', referencedColumnName: 'id' })
  contact: DBContact;

  @Column({ nullable: false })
  propertyId: string;

  @ManyToOne(() => DBProperty, (property) => property.stakeholders)
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: DBProperty;

  @OneToMany(() => DBAllocation, (allocation) => allocation.stakeholder)
  allocations: DBAllocation[];
}
