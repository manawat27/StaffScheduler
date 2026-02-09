import { Global, Module, Scope } from '@nestjs/common';
import { getOrganizationConnection } from './connection.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CONNECTION } from './connection.symbols';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: Request) => {
    const organizationId = request.user?.organizationId;

    if (organizationId) {
      return getOrganizationConnection(organizationId);
    }

    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class ConnectionModule {}
