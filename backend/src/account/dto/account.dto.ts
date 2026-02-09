export class AccountDto {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  company_name: string;
  active: boolean;
  account_plan_type_code: string;
  payment_customer_id: string;
  who_created: string;
  when_created: Date;
  who_updated: string;
  when_updated: Date;
}
