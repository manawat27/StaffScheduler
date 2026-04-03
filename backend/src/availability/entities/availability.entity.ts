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
import { StaffProfile } from "../../staff-profile/entities/staff-profile.entity";

@Entity("availability")
@Unique(["staff_profile_id", "day_of_week"])
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "staff_profile_id" })
  staff_profile_id: string;

  @ManyToOne(() => StaffProfile, (sp) => sp.availability, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "staff_profile_id" })
  staff_profile: StaffProfile;

  @Column({ name: "day_of_week" })
  day_of_week: number;

  @Column({ name: "is_available", default: true })
  is_available: boolean;

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
