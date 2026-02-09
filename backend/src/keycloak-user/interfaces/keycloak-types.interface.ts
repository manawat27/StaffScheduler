export interface KeycloakUserRepresentation {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  attributes?: Record<string, string[]>;
  groups?: string[];
  createdTimestamp?: number;
}

export interface KeycloakOrganizationRepresentation {
  id?: string;
  name?: string;
  alias?: string;
  enabled?: boolean;
  description?: string;
  attributes?: Record<string, string[]>;
  domains?: { name?: string; verified?: boolean }[];
}

export interface KeycloakCreateUserResponse {
  id: string;
}

export interface KeycloakErrorResponse {
  error: string;
  error_description?: string;
}
