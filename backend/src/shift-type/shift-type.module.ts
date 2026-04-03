import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShiftType } from "./entities/shift-type.entity";
import { ShiftTypeController } from "./shift-type.controller";
import { ShiftTypeService } from "./shift-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([ShiftType])],
  controllers: [ShiftTypeController],
  providers: [ShiftTypeService],
  exports: [ShiftTypeService],
})
export class ShiftTypeModule {}
