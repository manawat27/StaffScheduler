import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository, Between } from "typeorm";
import { Schedule } from "./entities/schedule.entity";
import { ScheduleShift } from "./entities/schedule-shift.entity";
import { StaffingRequirement } from "./entities/staffing-requirement.entity";
import { StaffProfile } from "../staff-profile/entities/staff-profile.entity";
import { Availability } from "../availability/entities/availability.entity";
import { TimeOffRequest } from "../time-off/entities/time-off-request.entity";
import { ShiftType } from "../shift-type/entities/shift-type.entity";
import {
  CreateScheduleDto,
  AddShiftDto,
  AssignShiftDto,
  CreateStaffingRequirementDto,
  UpdateStaffingRequirementDto,
} from "./dto/schedule.dto";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private getRepository<T>(entity: new () => T): Repository<T> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(entity);
  }

  private get scheduleRepo(): Repository<Schedule> {
    return this.getRepository(Schedule);
  }

  private get shiftRepo(): Repository<ScheduleShift> {
    return this.getRepository(ScheduleShift);
  }

  private get requirementRepo(): Repository<StaffingRequirement> {
    return this.getRepository(StaffingRequirement);
  }

  // ─── Schedule CRUD ──────────────────────────────────────

  async findAllSchedules() {
    return this.scheduleRepo.find({ order: { start_date: "DESC" } });
  }

  async findPublishedSchedules() {
    return this.scheduleRepo.find({
      where: { status: "published" },
      order: { start_date: "DESC" },
    });
  }

  async findScheduleById(id: string) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: [
        "shifts",
        "shifts.shift_type",
        "shifts.position",
        "shifts.staff_profile",
      ],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }
    return schedule;
  }

  async createSchedule(dto: CreateScheduleDto) {
    const entity = this.scheduleRepo.create(dto);
    return this.scheduleRepo.save(entity);
  }

  async publishSchedule(id: string, username: string) {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }
    if (schedule.status !== "draft") {
      throw new BadRequestException("Only draft schedules can be published");
    }
    schedule.status = "published";
    schedule.who_updated = username;
    return this.scheduleRepo.save(schedule);
  }

  async archiveSchedule(id: string, username: string) {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }
    schedule.status = "archived";
    schedule.who_updated = username;
    return this.scheduleRepo.save(schedule);
  }

  // ─── Shift Management ──────────────────────────────────

  async addShift(scheduleId: string, dto: AddShiftDto) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${scheduleId} not found`);
    }
    const entity = this.shiftRepo.create({
      schedule_id: scheduleId,
      ...dto,
    });
    return this.shiftRepo.save(entity);
  }

  async assignShift(shiftId: string, dto: AssignShiftDto) {
    const shift = await this.shiftRepo.findOne({ where: { id: shiftId } });
    if (!shift) {
      throw new NotFoundException(`Shift ${shiftId} not found`);
    }
    shift.staff_profile_id = dto.staff_profile_id || null;
    shift.who_updated = dto.who_updated;
    if (dto.staff_profile_id) {
      shift.is_in_pool = false;
    }
    return this.shiftRepo.save(shift);
  }

  async getShiftsForStaff(staffProfileId: string) {
    return this.shiftRepo.find({
      where: { staff_profile_id: staffProfileId },
      relations: ["schedule", "shift_type", "position"],
      order: { date: "ASC" },
    });
  }

  async getShiftsForStaffInCurrentSchedule(staffProfileId: string) {
    const published = await this.scheduleRepo.find({
      where: { status: "published" },
      order: { start_date: "DESC" },
      take: 1,
    });
    if (published.length === 0) return [];
    return this.shiftRepo.find({
      where: {
        schedule_id: published[0].id,
        staff_profile_id: staffProfileId,
      },
      relations: ["shift_type", "position"],
      order: { date: "ASC" },
    });
  }

  // ─── Staffing Requirements ─────────────────────────────

  async findAllRequirements() {
    return this.requirementRepo.find({
      relations: ["shift_type", "position"],
    });
  }

  async createRequirement(dto: CreateStaffingRequirementDto) {
    const entity = this.requirementRepo.create(dto);
    return this.requirementRepo.save(entity);
  }

  async updateRequirement(id: string, dto: UpdateStaffingRequirementDto) {
    await this.requirementRepo.update(id, dto);
    return this.requirementRepo.findOne({
      where: { id },
      relations: ["shift_type", "position"],
    });
  }

  async deleteRequirement(id: string) {
    return this.requirementRepo.delete(id);
  }

  // ─── Auto-Generate Schedule ────────────────────────────

  async autoGenerate(scheduleId: string, username: string) {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule ${scheduleId} not found`);
    }
    if (schedule.status !== "draft") {
      throw new BadRequestException(
        "Can only auto-generate for draft schedules",
      );
    }

    const connection = this.request.dbConnection as DataSource;

    // Load data
    const requirements = await this.requirementRepo.find();
    if (requirements.length === 0) {
      throw new BadRequestException(
        "No staffing requirements configured. Please set up staffing requirements first.",
      );
    }

    const shiftTypes = await connection.getRepository(ShiftType).find({
      where: { is_active: true },
    });

    const staffProfiles = await connection.getRepository(StaffProfile).find({
      where: { is_active: true },
      relations: ["position", "availability"],
    });

    const timeOffRequests = await connection
      .getRepository(TimeOffRequest)
      .find({
        where: {
          status: "approved",
        },
      });

    // Clear existing auto-generated shifts for this schedule
    await this.shiftRepo.delete({ schedule_id: scheduleId });

    // Build date range
    const dates: string[] = [];
    const start = new Date(schedule.start_date);
    const end = new Date(schedule.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }

    // Track assignments for constraint checking
    const staffHoursMap = new Map<string, number>(); // staffProfileId -> total hours
    const staffConsecutiveMap = new Map<string, number>(); // staffProfileId -> current consecutive days
    const staffLastDateMap = new Map<string, string>(); // staffProfileId -> last assigned date

    const createdShifts: ScheduleShift[] = [];

    for (const dateStr of dates) {
      const dayOfWeek = new Date(dateStr).getDay(); // 0=Sun..6=Sat

      for (const shiftType of shiftTypes) {
        // Calculate shift duration in hours
        const [startH, startM] = shiftType.start_time.split(":").map(Number);
        const [endH, endM] = shiftType.end_time.split(":").map(Number);
        const shiftHours = endH - startH + (endM - startM) / 60;

        // Get requirements for this shift type
        const reqs = requirements.filter(
          (r) => r.shift_type_id === shiftType.id,
        );

        for (const req of reqs) {
          for (let count = 0; count < req.required_count; count++) {
            // Find eligible staff
            const eligible = staffProfiles.filter((sp) => {
              // Must match position
              if (sp.position_id !== req.position_id) return false;

              // Must be available on this day of week
              const avail = sp.availability?.find(
                (a) => a.day_of_week === dayOfWeek,
              );
              if (avail && !avail.is_available) return false;

              // Must not have approved time-off on this date
              const hasTimeOff = timeOffRequests.some(
                (tor) =>
                  tor.staff_profile_id === sp.id &&
                  dateStr >= tor.start_date &&
                  dateStr <= tor.end_date,
              );
              if (hasTimeOff) return false;

              // Check max hours per week constraint
              const currentHours = staffHoursMap.get(sp.id) || 0;
              if (currentHours + shiftHours > sp.max_hours_per_week)
                return false;

              // Check max consecutive days constraint
              const lastDate = staffLastDateMap.get(sp.id);
              const consecutive = staffConsecutiveMap.get(sp.id) || 0;
              if (lastDate) {
                const last = new Date(lastDate);
                const curr = new Date(dateStr);
                const diffDays =
                  (curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1 && consecutive >= sp.max_consecutive_days) {
                  return false;
                }
              }

              // Check not already assigned to a shift on this date+shiftType
              const alreadyAssigned = createdShifts.some(
                (cs) =>
                  cs.staff_profile_id === sp.id &&
                  cs.date === dateStr &&
                  cs.shift_type_id === shiftType.id,
              );
              if (alreadyAssigned) return false;

              return true;
            });

            // Sort by fairness (fewest hours) then priority (higher priority as tiebreaker)
            eligible.sort((a, b) => {
              const hoursA = staffHoursMap.get(a.id) || 0;
              const hoursB = staffHoursMap.get(b.id) || 0;
              if (hoursA !== hoursB) return hoursA - hoursB; // fewer hours first
              return b.priority - a.priority; // higher priority first
            });

            const assigned = eligible.length > 0 ? eligible[0] : null;

            const shift = this.shiftRepo.create({
              schedule_id: scheduleId,
              shift_type_id: shiftType.id,
              position_id: req.position_id,
              date: dateStr,
              staff_profile_id: assigned?.id || null,
              is_in_pool: !assigned,
              who_created: username,
            });

            const saved = await this.shiftRepo.save(shift);
            createdShifts.push(saved);

            // Update tracking
            if (assigned) {
              const prevHours = staffHoursMap.get(assigned.id) || 0;
              staffHoursMap.set(assigned.id, prevHours + shiftHours);

              const lastDate = staffLastDateMap.get(assigned.id);
              if (lastDate) {
                const last = new Date(lastDate);
                const curr = new Date(dateStr);
                const diffDays =
                  (curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                  staffConsecutiveMap.set(
                    assigned.id,
                    (staffConsecutiveMap.get(assigned.id) || 0) + 1,
                  );
                } else {
                  staffConsecutiveMap.set(assigned.id, 1);
                }
              } else {
                staffConsecutiveMap.set(assigned.id, 1);
              }
              staffLastDateMap.set(assigned.id, dateStr);
            }
          }
        }
      }
    }

    return this.findScheduleById(scheduleId);
  }
}
