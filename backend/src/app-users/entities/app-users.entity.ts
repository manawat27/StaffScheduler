import { AppUsersRoles } from "src/app-users-roles/entities/app-users-roles.entity";

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity()
export class AppUsers {
  @PrimaryColumn("uuid")
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "user_name", unique: true })
  user_name: string;

  @Column({ name: "first_name" })
  first_name: string;

  @Column({ name: "last_name" })
  last_name: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => AppUsersRoles, (role) => role.roles)
  @JoinColumn({ name: "role", referencedColumnName: "code" })
  role: AppUsersRoles;

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;

  @Column({ nullable: false, default: true })
  enabled: boolean;
}
