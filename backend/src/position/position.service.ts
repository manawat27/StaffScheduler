import { Inject, Injectable, Logger } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository } from "typeorm";
import { Position } from "./entities/position.entity";
import { CreatePositionDto } from "./dto/create-position.dto";
import { UpdatePositionDto } from "./dto/update-position.dto";

@Injectable()
export class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repository(): Repository<Position> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(Position);
  }

  async findAll() {
    return this.repository.find({ order: { name: "ASC" } });
  }

  async findActive() {
    return this.repository.find({
      where: { is_active: true },
      order: { name: "ASC" },
    });
  }

  async findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(dto: CreatePositionDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async update(id: string, dto: UpdatePositionDto) {
    await this.repository.update(id, dto);
    return this.repository.findOne({ where: { id } });
  }
}
