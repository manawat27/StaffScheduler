import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountPlanType } from '../../account-plan-type/entities/account-plan-type.entity';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', nullable: false })
  first_name: string;

  @Column({ name: 'last_name', nullable: false })
  last_name: string;

  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @Column({ name: 'email_address', type: 'citext', unique: true, nullable: false })
  email_address: string;

  @Column({ name: 'company_name', nullable: false })
  company_name: string;

  @Column({ name: 'active', type: 'boolean', default: true, nullable: false })
  active: boolean;

  @ManyToOne(() => AccountPlanType, (accountPlanType) => accountPlanType.accounts)
  @JoinColumn({ name: 'account_plan_type_code', referencedColumnName: 'code' })
  account_plan_type: AccountPlanType;

  @Column({ name: 'payment_customer_id', nullable: true })
  payment_customer_id: string;

  @Column({ name: 'who_created', length: 100, nullable: true })
  who_created: string;

  @CreateDateColumn({ name: 'when_created' })
  when_created: Date;

  @Column({ name: 'who_updated', length: 100, nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: 'when_updated' })
  when_updated: Date;
}
