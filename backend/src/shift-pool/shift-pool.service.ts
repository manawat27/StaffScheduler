import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository } from "typeorm";
import { ShiftPoolRequest } from "./entities/shift-pool-request.entity";
import { ScheduleShift } from "../schedule/entities/schedule-shift.entity";
import { StaffProfile } from "../staff-profile/entities/staff-profile.entity";
import {
  CreateShiftPoolRequestDto,
  ReviewShiftPoolRequestDto,
} from "./dto/shift-pool.dto";

@Injectable()
export class ShiftPoolService {
  private readonly logger = new Logger(ShiftPoolService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private getRepository<T>(entity: new () => T): Repository<T> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(entity);
  }

  private get requestRepo(): Repository<ShiftPoolRequest> {
    return this.getRepository(ShiftPoolRequest);
  }

  private get shiftRepo(): Repository<ScheduleShift> {
    return this.getRepository(ScheduleShift);
  }

  /**
   * Get all open pool shifts, optionally filtered by the staff member's position.
   */
  async findOpenShifts(positionId?: string) {
    const query = this.shiftRepo
      .createQueryBuilder("ss")
      .leftJoinAndSelect("ss.shift_type", "shift_type")
      .leftJoinAndSelect("ss.position", "position")
      .leftJoinAndSelect("ss.schedule", "schedule")
      .where("ss.is_in_pool = :isInPool", { isInPool: true })
      .andWhere("ss.staff_profile_id IS NULL")
      .andWhere("schedule.status = :status", { status: "published" });

    if (positionId) {
      query.andWhere("ss.position_id = :positionId", { positionId });
    }

    query.orderBy("ss.date", "ASC");
    return query.getMany();
  }

  /**
   * Staff submits a request for a pooled shift.
   */
  async createRequest(dto: CreateShiftPoolRequestDto) {
    const shift = await this.shiftRepo.findOne({
      where: { id: dto.schedule_shift_id },
    });
    if (!shift) {
      throw new NotFoundException("Shift not found");
    }
    if (!shift.is_in_pool || shift.staff_profile_id) {
      throw new BadRequestException("This shift is not available in the pool");
    }

    // Check if staff already requested this shift
    const existing = await this.requestRepo.findOne({
      where: {
        schedule_shift_id: dto.schedule_shift_id,
        staff_profile_id: dto.staff_profile_id,
      },
    });
    if (existing) {
      throw new ConflictException("You have already requested this shift");
    }

    const entity = this.requestRepo.create(dto);
    return this.requestRepo.save(entity);
  }

  /**
   * Manager views requests for a specific shift, sorted by staff priority.
   */
  async findRequestsForShift(scheduleShiftId: string) {
    return this.requestRepo.find({
      where: { schedule_shift_id: scheduleShiftId },
      relations: ["staff_profile", "staff_profile.position"],
      order: { staff_profile: { priority: "DESC" } },
    });
  }

  /**
   * Get all requests by a specific staff member.
   */
  async findRequestsByStaff(staffProfileId: string) {
    return this.requestRepo.find({
      where: { staff_profile_id: staffProfileId },
      relations: [
        "schedule_shift",
        "schedule_shift.shift_type",
        "schedule_shift.position",
      ],
      order: { requested_at: "DESC" },
    });
  }

  /**
   * Manager approves a request: assigns the staff to the shift, denies all other pending requests.
   */
  async reviewRequest(
    requestId: string,
    dto: ReviewShiftPoolRequestDto,
    reviewerUuid: string,
    reviewerUsername: string,
  ) {
    const poolRequest = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ["schedule_shift"],
    });
    if (!poolRequest) {
      throw new NotFoundException("Request not found");
    }

    poolRequest.status = dto.status;
    poolRequest.reviewed_by = reviewerUuid;
    poolRequest.reviewed_at = new Date();
    poolRequest.who_updated = reviewerUsername;
    await this.requestRepo.save(poolRequest);

    if (dto.status === "approved") {
      // Assign the staff to the shift
      const shift = poolRequest.schedule_shift;
      shift.staff_profile_id = poolRequest.staff_profile_id;
      shift.is_in_pool = false;
      shift.who_updated = reviewerUsername;
      await this.shiftRepo.save(shift);

      // Deny all other pending requests for this shift
      const otherRequests = await this.requestRepo.find({
        where: {
          schedule_shift_id: poolRequest.schedule_shift_id,
          status: "pending",
        },
      });
      for (const other of otherRequests) {
        if (other.id !== requestId) {
          other.status = "denied";
          other.reviewed_by = reviewerUuid;
          other.reviewed_at = new Date();
          other.who_updated = reviewerUsername;
          await this.requestRepo.save(other);
        }
      }
    }

    return poolRequest;
  }
}
