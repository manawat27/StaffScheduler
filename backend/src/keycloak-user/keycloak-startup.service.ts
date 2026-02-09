import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KeycloakConfig } from './keycloak.config';

@Injectable()
export class KeycloakStartupService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakStartupService.name);

  constructor(private readonly keycloakConfig: KeycloakConfig) {}

  async onModuleInit() {
    try {
      await this.updateOrganizationProtocolMapper();
      this.logger.log('Organization protocol mapper updated at startup.');
    } catch (err) {
      this.logger.error('Failed to update organization protocol mapper at startup:', err);
    }
  }

  /**
   * There's probably a way to do this with the realm-config but I have run into many issues trying
   * @returns
   */
  async updateOrganizationProtocolMapper(): Promise<void> {
    const httpClient = await this.keycloakConfig.getHttpClient();

    const clientScopesResp = await httpClient.get('/client-scopes');

    const organizationClientScope = clientScopesResp.data.find((scope) => scope.name === 'organization');
    const organizationClientScopeId = organizationClientScope.id;

    const mappersResp = await httpClient.get(`/client-scopes/${organizationClientScopeId}/protocol-mappers/models`);
    const orgMapper = mappersResp.data.find((m) => m.protocolMapper === 'oidc-organization-membership-mapper');

    const updatedMapper = {
      ...orgMapper,
      config: {
        ...orgMapper.config,
        addOrganizationId: 'true',
      },
    };
    await httpClient.put(
      `/client-scopes/${organizationClientScopeId}/protocol-mappers/models/${orgMapper.id}`,
      updatedMapper
    );
  }
}
