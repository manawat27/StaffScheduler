import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { StaffProfile } from "../../staff-profile/entities/staff-profile.entity";

@Entity("time_off_request")
export class TimeOffRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "staff_profile_id" })
  staff_profile_id: string;

  @ManyToOne(() => StaffProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "staff_profile_id" })
  staff_profile: StaffProfile;

  @Column({ name: "start_date", type: "date" })
  start_date: string;

  @Column({ name: "end_date", type: "date" })
  end_date: string;

  @Column({ type: "text", nullable: true })
  reason: string;

  @Column({ length: 20, default: "pending" })
  status: string;

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
