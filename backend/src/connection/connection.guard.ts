import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getOrganizationConnection } from './connection.util';
import { AuthenticatedUser } from 'src/auth/jwt.strategy';
import { Request } from 'express';

@Injectable()
export class ConnectionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser;

    if (user?.organizationId) {
      request['dbConnection'] = await getOrganizationConnection(user.organizationId);
    }

    return true;
  }
}
