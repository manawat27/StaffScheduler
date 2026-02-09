import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { ConfigService } from "@nestjs/config";
import { AccountService } from "src/account/account.service";

interface KeycloakPayload {
  sub: string;
  realm_access?: {
    roles?: string[];
  };
  organization?: {
    [key: string]: {
      id: string;
    };
  };
  preferred_username: string;
  email: string;
  given_name: string;
  family_name: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  roles: string[];
  organizationId: string;
  accountType: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly accountService: AccountService,
  ) {
    const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "buildops";
    const jwtIssuer =
      process.env.ENVIRONMENT === "local"
        ? "http://localhost:8080/realms/buildops"
        : process.env.JWT_ISSUER;
    const jwksUri =
      process.env.ENVIRONMENT === "local"
        ? "http://localhost:8080/realms/buildops/protocol/openid-connect/certs"
        : process.env.JWKS_URI;

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: keycloakClientId,
      issuer: jwtIssuer,
      algorithms: ["RS256"],
    });
  }

  async validate(payload: KeycloakPayload): Promise<AuthenticatedUser> {
    const roles = payload.realm_access?.roles || [];
    let organizationId: string | undefined;

    if (payload.organization) {
      const orgValues = Object.values(payload.organization);
      if (orgValues.length > 0) {
        organizationId = orgValues[0].id;
      }
    }
    let accountType: string | undefined;
    try {
      const account = await this.accountService.findOne(payload.email);
      accountType = account?.account_plan_type?.code;
    } catch (error) {
      console.warn(
        "Failed to fetch account type for user:",
        payload.email,
        error,
      );
    }
    return {
      id: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      first_name: payload.given_name,
      last_name: payload.family_name,
      roles: roles,
      organizationId,
      accountType,
    };
  }
}
