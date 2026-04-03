import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Schedule } from "./schedule.entity";
import { ShiftType } from "../../shift-type/entities/shift-type.entity";
import { Position } from "../../position/entities/position.entity";
import { StaffProfile } from "../../staff-profile/entities/staff-profile.entity";

@Entity("schedule_shift")
export class ScheduleShift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "schedule_id" })
  schedule_id: string;

  @ManyToOne(() => Schedule, (s) => s.shifts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "schedule_id" })
  schedule: Schedule;

  @Column({ name: "shift_type_id" })
  shift_type_id: string;

  @ManyToOne(() => ShiftType, { eager: true })
  @JoinColumn({ name: "shift_type_id" })
  shift_type: ShiftType;

  @Column({ name: "position_id" })
  position_id: string;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: "position_id" })
  position: Position;

  @Column({ type: "date" })
  date: string;

  @Column({ name: "staff_profile_id", nullable: true })
  staff_profile_id: string;

  @ManyToOne(() => StaffProfile, { nullable: true, eager: true })
  @JoinColumn({ name: "staff_profile_id" })
  staff_profile: StaffProfile;

  @Column({ name: "is_in_pool", default: false })
  is_in_pool: boolean;

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
