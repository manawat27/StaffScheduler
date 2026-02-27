import { AppUserRole } from "./AppUserRole"
import { AuditVariables } from "./AuditVariables"

export class AppUser extends AuditVariables {
  uuid: string
  email: string
  user_name: string
  first_name: string
  last_name: string
  phone: string | null
  avatar?: string | Buffer | null
  role: AppUserRole
  enabled: boolean

  fullName?() {
    return `${this.first_name} ${this.last_name}`
  }

  constructor(
    uuid: string,
    email: string,
    user_name: string,
    first_name: string,
    last_name: string,
    phone: string | null,
    avatar: Buffer | null,
    role: AppUserRole,
    enabled: boolean,
  ) {
    super()
    this.uuid = uuid
    this.email = email
    this.user_name = user_name
    this.first_name = first_name
    this.last_name = last_name
    this.phone = phone
    this.avatar = avatar
    this.role = role
    this.enabled = enabled
  }
}

export interface CreateAppUser {
  uuid?: string
  email?: string
  user_name?: string
  first_name?: string
  last_name?: string
  phone?: string | null
  role?: string
}

export interface UpdateAppUser {
  uuid: string
  email: string
  user_name?: string
  first_name: string
  last_name: string
  phone: string | null
  role: string
  avatar?: string | Buffer | null
}
