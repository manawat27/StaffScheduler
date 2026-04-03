import { Inject, Injectable, Logger } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { DataSource, Repository } from "typeorm";
import { Availability } from "./entities/availability.entity";
import { SetAvailabilityDto } from "./dto/set-availability.dto";

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get repository(): Repository<Availability> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(Availability);
  }

  async findByStaffProfile(staffProfileId: string) {
    return this.repository.find({
      where: { staff_profile_id: staffProfileId },
      order: { day_of_week: "ASC" },
    });
  }

  async setAvailability(
    staffProfileId: string,
    dto: SetAvailabilityDto,
    username: string,
  ) {
    const results: Availability[] = [];

    for (const entry of dto.entries) {
      const existing = await this.repository.findOne({
        where: {
          staff_profile_id: staffProfileId,
          day_of_week: entry.day_of_week,
        },
      });

      if (existing) {
        existing.is_available = entry.is_available;
        existing.who_updated = username;
        results.push(await this.repository.save(existing));
      } else {
        const newEntry = this.repository.create({
          staff_profile_id: staffProfileId,
          day_of_week: entry.day_of_week,
          is_available: entry.is_available,
          who_created: username,
        });
        results.push(await this.repository.save(newEntry));
      }
    }

    return results;
  }
}
