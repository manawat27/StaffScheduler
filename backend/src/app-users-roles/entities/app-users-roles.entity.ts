import { AppUsers } from 'src/app-users/entities/app-users.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppUsersRoles {
  @PrimaryColumn({ nullable: false })
  code: string;
  @Column({ nullable: false })
  description: string;
  @Column({ nullable: false })
  effective_date: Date;
  @Column({ nullable: false })
  expiry_date: Date;
  @OneToMany(() => AppUsers, (app_users) => app_users.role)
  roles: AppUsers[];
  @Column()
  who_created: string;
  @CreateDateColumn()
  when_created: Date;
  @Column()
  who_updated: string;
  @UpdateDateColumn()
  when_updated: Date;
}
