import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountPlanType } from './entities/account-plan-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountPlanTypeService {
  constructor(
    @InjectRepository(AccountPlanType)
    private readonly accountPlanTypeRepository: Repository<AccountPlanType>
  ) {}

  findAll() {
    return this.accountPlanTypeRepository.find();
  }

  findOne(code: string) {
    return this.accountPlanTypeRepository.findOneBy({ code });
  }
}
