import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Keycloak from 'keycloak-connect';
import session from 'express-session';

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID,
  secret: process.env.KEYCLOAK_CLIENT_SECRET,
  'confidential-port': 0,
};

const keycloak = new Keycloak({
  store: new session.MemoryStore(),
}, keycloakConfig);

@Injectable()
export class KeycloakMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const [middleware] = keycloak.middleware();
    middleware(req, res, next);
  }
}

export { keycloak };
