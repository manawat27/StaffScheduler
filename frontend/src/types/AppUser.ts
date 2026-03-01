import { AppUserRole } from "./AppUserRole"
import { AuditVariables } from "./AuditVariables"

export class AppUser extends AuditVariables {
  uuid?: string
  firstName: string
  lastName: string
  email: string
  userName: string
  phone: string | null
  dateOfBirth?: string | null
  country: string | null
  city: string | null
  postalCode: string | null
  avatar?: string | Buffer | null
  roles: string[]
  enabled: boolean

  fullName?() {
    return `${this.firstName} ${this.lastName}`
  }

  constructor(
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    phone: string | null,
    dateOfBirth: string | null,
    country: string | null,
    city: string | null,
    postalCode: string | null,
    avatar: Buffer | null,
    roles: string[],
    enabled: boolean,
  ) {
    super()
    this.uuid = uuid
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.userName = userName
    this.phone = phone
    this.dateOfBirth = dateOfBirth
    this.country = country
    this.city = city
    this.postalCode = postalCode
    this.avatar = avatar
    this.roles = roles
    this.enabled = enabled
  }
}

export interface CreateAppUser {
  uuid?: string
  firstName?: string
  lastName?: string
  email?: string
  userName?: string
  phone?: string | null
  dateOfBirth?: string | null
  country?: string | null
  city?: string | null
  postalCode?: string | null
  avatar?: string | Buffer | null
  roles?: string[]
}

export interface UpdateAppUser {
  uuid?: string
  firstName: string
  lastName: string
  email: string
  userName?: string
  phone: string | null
  dateOfBirth?: string | null
  country: string | null
  city: string | null
  postalCode: string | null
  roles: string[]
  avatar?: string | Buffer | null
}
