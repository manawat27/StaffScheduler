import { Inject, Injectable, Logger } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository } from "typeorm";
import { ShiftType } from "./entities/shift-type.entity";
import { CreateShiftTypeDto } from "./dto/create-shift-type.dto";
import { UpdateShiftTypeDto } from "./dto/update-shift-type.dto";

@Injectable()
export class ShiftTypeService {
  private readonly logger = new Logger(ShiftTypeService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repository(): Repository<ShiftType> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(ShiftType);
  }

  async findAll() {
    return this.repository.find({ order: { name: "ASC" } });
  }

  async findActive() {
    return this.repository.find({
      where: { is_active: true },
      order: { start_time: "ASC" },
    });
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(dto: CreateShiftTypeDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async update(id: string, dto: UpdateShiftTypeDto) {
    await this.repository.update(id, dto);
    return this.repository.findOne({ where: { id } });
  }
}
