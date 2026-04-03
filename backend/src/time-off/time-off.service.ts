import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { TimeOffRequest } from "./entities/time-off-request.entity";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";
import { ReviewTimeOffDto } from "./dto/review-time-off.dto";

@Injectable()
export class TimeOffService {
  private readonly logger = new Logger(TimeOffService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repository(): Repository<TimeOffRequest> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(TimeOffRequest);
  }

  async findAll() {
    return this.repository.find({
      relations: ["staff_profile", "staff_profile.position"],
      order: { when_created: "DESC" },
    });
  }

  async findByStaffProfile(staffProfileId: string) {
    return this.repository.find({
      where: { staff_profile_id: staffProfileId },
      order: { start_date: "DESC" },
    });
  }

  async findApprovedInRange(startDate: string, endDate: string) {
    return this.repository.find({
      where: {
        status: "approved",
        start_date: LessThanOrEqual(endDate),
        end_date: MoreThanOrEqual(startDate),
      },
      relations: ["staff_profile"],
    });
  }

  async create(dto: CreateTimeOffDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async review(
    id: string,
    dto: ReviewTimeOffDto,
    reviewerUuid: string,
    reviewerUsername: string,
  ) {
    const request = await this.repository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Time-off request ${id} not found`);
    }
    request.status = dto.status;
    request.reviewed_by = reviewerUuid;
    request.reviewed_at = new Date();
    request.who_updated = reviewerUsername;
    return this.repository.save(request);
  }
}
