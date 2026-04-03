import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { ScheduleShift } from "../../schedule/entities/schedule-shift.entity";
import { StaffProfile } from "../../staff-profile/entities/staff-profile.entity";

@Entity("shift_pool_request")
@Unique(["schedule_shift_id", "staff_profile_id"])
export class ShiftPoolRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "schedule_shift_id" })
  schedule_shift_id: string;

  @ManyToOne(() => ScheduleShift, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "schedule_shift_id" })
  schedule_shift: ScheduleShift;

  @Column({ name: "staff_profile_id" })
  staff_profile_id: string;

  @ManyToOne(() => StaffProfile, { eager: true })
  @JoinColumn({ name: "staff_profile_id" })
  staff_profile: StaffProfile;

  @Column({ length: 20, default: "pending" })
  status: string;

  @Column({
    name: "requested_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  requested_at: Date;

  @Column({ name: "reviewed_by", nullable: true })
  reviewed_by: string;

  @Column({ name: "reviewed_at", type: "timestamp", nullable: true })
  reviewed_at: Date;

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
