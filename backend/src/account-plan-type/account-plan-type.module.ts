import { Module } from '@nestjs/common';
import { AccountPlanTypeService } from './account-plan-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPlanType } from './entities/account-plan-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountPlanType])],
  providers: [AccountPlanTypeService],
  exports: [AccountPlanTypeService],
})
export class AccountPlanTypeModule {}
