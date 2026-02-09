import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('account_plan_type_code')
export class AccountPlanType {
  @PrimaryColumn({ name: 'code', type: 'text' })
  code: string;

  @Column({ name: 'description', nullable: false })
  description: string;

  @Column({ name: 'who_created', length: 100, nullable: true })
  who_created: string;

  @CreateDateColumn({ name: 'when_created' })
  when_created: Date;

  @Column({ name: 'who_updated', length: 100, nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: 'when_updated' })
  when_updated: Date;

  @OneToMany(() => Account, (account) => account.account_plan_type)
  accounts: Account[];
}
