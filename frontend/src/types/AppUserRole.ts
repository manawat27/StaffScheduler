export class AppUserRole {
  code: string
  description: string
  effective_date: Date
  expiry_date: Date

  constructor(
    code: string,
    description: string,
    effective_date: Date,
    expiry_date: Date,
  ) {
    this.code = code
    this.description = description
    this.effective_date = effective_date
    this.expiry_date = expiry_date
  }
}
