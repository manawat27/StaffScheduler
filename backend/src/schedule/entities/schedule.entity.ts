import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ScheduleShift } from "./schedule-shift.entity";

@Entity("schedule")
export class Schedule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: "start_date", type: "date" })
  start_date: string;

  @Column({ name: "end_date", type: "date" })
  end_date: string;

  @Column({ length: 20, default: "draft" })
  status: string;

  @OneToMany(() => ScheduleShift, (ss) => ss.schedule)
  shifts: ScheduleShift[];

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
