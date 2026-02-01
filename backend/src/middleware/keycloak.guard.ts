import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { keycloak } from './keycloak.middleware';

@Injectable()
export class KeycloakGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return new Promise((resolve) => {
      keycloak.protect()(req, res, () => {
        resolve(true);
      });
    });
  }
}
