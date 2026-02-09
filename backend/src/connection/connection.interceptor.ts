import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getOrganizationConnection } from './connection.util';

@Injectable()
export class ConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.organizationId) {
      request.dbConnection = await getOrganizationConnection(user.organizationId);
    }

    return next.handle();
  }
}
