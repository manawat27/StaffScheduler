import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Position } from "../../position/entities/position.entity";
import { Availability } from "../../availability/entities/availability.entity";

@Entity("staff_profile")
export class StaffProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_uuid", unique: true })
  user_uuid: string;

  @Column({ name: "position_id", nullable: true })
  position_id: string;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: "position_id" })
  position: Position;

  @Column({ default: 5 })
  priority: number;

  @Column({ name: "max_hours_per_week", default: 40 })
  max_hours_per_week: number;

  @Column({ name: "max_consecutive_days", default: 5 })
  max_consecutive_days: number;

  @Column({ name: "is_active", default: true })
  is_active: boolean;

  @OneToMany(() => Availability, (a) => a.staff_profile)
  availability: Availability[];

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
