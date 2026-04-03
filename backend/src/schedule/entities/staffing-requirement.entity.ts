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
import { ShiftType } from "../../shift-type/entities/shift-type.entity";
import { Position } from "../../position/entities/position.entity";

@Entity("staffing_requirement")
@Unique(["shift_type_id", "position_id"])
export class StaffingRequirement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @Column({ name: "required_count", default: 1 })
  required_count: number;

  @Column({ name: "who_created", nullable: true })
  who_created: string;

  @CreateDateColumn({ name: "when_created" })
  when_created: Date;

  @Column({ name: "who_updated", nullable: true })
  who_updated: string;

  @UpdateDateColumn({ name: "when_updated" })
  when_updated: Date;
}
