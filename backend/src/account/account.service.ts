import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPlanTypeService } from 'src/account-plan-type/account-plan-type.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly accountPlanTypeService: AccountPlanTypeService
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = this.accountRepository.create(createAccountDto);
    account.account_plan_type = await this.accountPlanTypeService.findOne(createAccountDto.account_plan_type_code);
    return this.accountRepository.save(account);
  }

  findOne(email_address: string) {
    return this.accountRepository.findOne({ where: { email_address }, relations: ['account_plan_type'] });
  }
}
