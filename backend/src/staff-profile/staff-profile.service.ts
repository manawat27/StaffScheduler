import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository } from "typeorm";
import { StaffProfile } from "./entities/staff-profile.entity";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";

@Injectable()
export class StaffProfileService {
  private readonly logger = new Logger(StaffProfileService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repository(): Repository<StaffProfile> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(StaffProfile);
  }

  async findAll() {
    return this.repository.find({
      relations: ["position", "availability"],
      order: { priority: "DESC" },
    });
  }

  async findActive() {
    return this.repository.find({
      where: { is_active: true },
      relations: ["position", "availability"],
      order: { priority: "DESC" },
    });
  }

  async findOne(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["position", "availability"],
    });
  }

  async findByUserUuid(userUuid: string) {
    return this.repository.findOne({
      where: { user_uuid: userUuid },
      relations: ["position", "availability"],
    });
  }

  async create(dto: CreateStaffProfileDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async update(id: string, dto: UpdateStaffProfileDto) {
    const profile = await this.repository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Staff profile ${id} not found`);
    }
    await this.repository.update(id, dto);
    return this.repository.findOne({
      where: { id },
      relations: ["position", "availability"],
    });
  }
}
