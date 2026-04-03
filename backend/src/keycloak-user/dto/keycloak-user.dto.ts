export class KeycloakUserDto {
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  enabled?: boolean;
  email_verified?: boolean;
  phone?: string;
  date_of_birth?: Date;
  country?: string;
  city?: string;
  postal_code?: string;
}
