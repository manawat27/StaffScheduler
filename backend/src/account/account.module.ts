import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPlanTypeModule } from 'src/account-plan-type/account-plan-type.module';

@Module({
  imports: [AccountPlanTypeModule, TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
