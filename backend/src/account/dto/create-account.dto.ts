import { PickType } from '@nestjs/swagger';
import { AccountDto } from './account.dto';

export class CreateAccountDto extends PickType(AccountDto, [
  'first_name',
  'last_name',
  'phone_number',
  'email_address',
  'company_name',
  'active',
  'account_plan_type_code',
  'payment_customer_id',
]) {}
