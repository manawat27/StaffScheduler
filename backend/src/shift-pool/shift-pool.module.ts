import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShiftPoolRequest } from "./entities/shift-pool-request.entity";
import { ShiftPoolController } from "./shift-pool.controller";
import { ShiftPoolService } from "./shift-pool.service";

@Module({
  imports: [TypeOrmModule.forFeature([ShiftPoolRequest])],
  controllers: [ShiftPoolController],
  providers: [ShiftPoolService],
  exports: [ShiftPoolService],
})
export class ShiftPoolModule {}
