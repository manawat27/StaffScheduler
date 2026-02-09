import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateKeycloakUserDto } from './dto/create-keycloak-user.dto';
import { UpdateKeycloakUserDto } from './dto/update-keycloak-user.dto';
import { AppUserService } from 'src/app-users/app-users.service';
import { KeycloakConfig } from './keycloak.config';
import { KeycloakUserRepresentation, KeycloakCreateUserResponse } from './interfaces/keycloak-types.interface';
import { AxiosResponse } from 'axios';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { AppUsersRoles } from 'src/app-users-roles/entities/app-users-roles.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KeycloakUserService {
  private readonly logger = new Logger(KeycloakUserService.name);

  constructor(
    @Inject(forwardRef(() => AppUserService))
    private readonly appUserService: AppUserService,
    private readonly keycloakConfig: KeycloakConfig
  ) {}

  /**
   * Creates a new user in Keycloak and in the database
   * @param createKeycloakUserDto
   * @param authenticatedUser
   */
  async create(
    createKeycloakUserDto: CreateKeycloakUserDto & { role: any; phone: string },
    authenticatedUser: AuthenticatedUser
  ): Promise<void> {
    try {
      const httpClient = await this.keycloakConfig.getHttpClient();

      const userPayload: KeycloakUserRepresentation = {
        username: createKeycloakUserDto.user_name,
        email: createKeycloakUserDto.email,
        firstName: createKeycloakUserDto.first_name,
        lastName: createKeycloakUserDto.last_name,
        enabled: true,
      };

      // Create user in Keycloak
      const createUserResponse: AxiosResponse<KeycloakCreateUserResponse> = await httpClient.post(
        '/users',
        userPayload
      );

      // Extract user ID from Location header
      const locationHeader = createUserResponse.headers.location;
      const userId = locationHeader.split('/').pop();

      // Get roles from keycloak & assign specified realm role to user
      const roleResponse = await httpClient.get(`/roles/${createKeycloakUserDto.role}`);
      const roleRepresentation = roleResponse.data;
      await httpClient.post(`/users/${userId}/role-mappings/realm`, [roleRepresentation]);

      // Retrieve the created user with full details
      const userResponse: AxiosResponse<KeycloakUserRepresentation> = await httpClient.get(`/users/${userId}`);
      const newUser = userResponse.data;

      // Send email to user to set their password
      const response = await httpClient.put(`/users/${userId}/execute-actions-email`, ['UPDATE_PASSWORD'], {
        params: {
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          redirect_uri: process.env.ENVIRONMENT === 'local' ? 'http://localhost:3000' : process.env.FRONTEND_URL,
        },
      });

      // Add the user to the same organization as the admin that is creating them
      await httpClient.post(`/organizations/${authenticatedUser.organizationId}/members`, newUser.id);

      // Create the user in the database
      await this.appUserService.create({
        uuid: newUser.id,
        email: newUser.email,
        user_name: newUser.username,
        first_name: newUser.firstName,
        last_name: newUser.lastName,
        phone: createKeycloakUserDto.phone,
        role: createKeycloakUserDto.role,
        who_created: authenticatedUser.id,
      });
      this.logger.log(`User created successfully: ${newUser.username}`);
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      if (error.response?.status === 409) {
        throw new BadRequestException('A user with this username or email already exists');
      }
      throw new InternalServerErrorException('Failed to create user in Keycloak');
    }
  }

  /**
   * Updates a user's details in Keycloak and in the database
   * @param uuid
   * @param updateKeycloakUserDto
   */
  async update(
    uuid: string,
    updateKeycloakUserDto: UpdateKeycloakUserDto & { role: AppUsersRoles; phone: string },
    who_updated: string
  ) {
    try {
      const httpClient = await this.keycloakConfig.getHttpClient();

      // Check if the user exists
      const existingUserResponse: AxiosResponse<KeycloakUserRepresentation> = await httpClient.get(`/users/${uuid}`);
      const existingUser = existingUserResponse.data;

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${uuid} not found`);
      }

      // Prepare update data
      const updateData: Partial<KeycloakUserRepresentation> = {};
      if (updateKeycloakUserDto.user_name) updateData.username = updateKeycloakUserDto.user_name;
      if (updateKeycloakUserDto.email) updateData.email = updateKeycloakUserDto.email;
      if (updateKeycloakUserDto.first_name) updateData.firstName = updateKeycloakUserDto.first_name;
      if (updateKeycloakUserDto.last_name) updateData.lastName = updateKeycloakUserDto.last_name;
      if (updateKeycloakUserDto.enabled !== undefined) updateData.enabled = updateKeycloakUserDto.enabled;
      if (updateKeycloakUserDto.email_verified !== undefined)
        updateData.emailVerified = updateKeycloakUserDto.email_verified;

      // Update the user in Keycloak
      await httpClient.put(`/users/${uuid}`, updateData);

      // Update the user's role
      const existingUserRoleMappings = await httpClient.get(`/users/${uuid}/role-mappings`);
      const existingUserRole = existingUserRoleMappings.data.realmMappings[0];
      const roleResponse = await httpClient.get(`/roles/${updateKeycloakUserDto.role.code}`);
      const roleRepresentation = roleResponse.data;
      if (existingUserRole.id !== roleRepresentation.id) {
        await httpClient.delete(`/users/${uuid}/role-mappings/realm`, { data: [existingUserRole] });
        await httpClient.post(`/users/${uuid}/role-mappings/realm`, [roleRepresentation]);
      }

      // Return updated user
      const updatedUserResponse: AxiosResponse<KeycloakUserRepresentation> = await httpClient.get(`/users/${uuid}`);
      const updatedUser = updatedUserResponse.data;

      // Update the user in the database
      await this.appUserService.update(updatedUser.id, {
        email: updatedUser.email,
        user_name: updatedUser.username,
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        phone: updateKeycloakUserDto.phone,
        role: updateKeycloakUserDto.role,
        who_updated: who_updated,
      });

      this.logger.log(`User updated successfully: ${updatedUser.username}`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`User with ID ${uuid} not found`);
      }
      this.logger.error(`Failed to update user ${uuid}:`, error);
      if (error.response?.status === 409) {
        throw new BadRequestException('Username or email already exists');
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Deletes a user from Keycloak and from the database
   * @param uuid
   * @returns
   */
  async remove(uuid: string) {
    try {
      const httpClient = await this.keycloakConfig.getHttpClient();

      // Check if the user exists
      const existingUserResponse: AxiosResponse<KeycloakUserRepresentation> = await httpClient.get(`/users/${uuid}`);
      const existingUser = existingUserResponse.data;
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${uuid} not found`);
      }

      // Delete user from Keycloak
      await httpClient.delete(`/users/${uuid}`);
      // Delete user from database
      await this.appUserService.delete(uuid);

      this.logger.log(`User deleted successfully: ${existingUser.username}`);
      return { message: 'User deleted successfully', deletedUserId: uuid };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`User with ID ${uuid} not found`);
      }
      this.logger.error(`Failed to delete user ${uuid}:`, error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Creates the org in keycloak and returns its ID
   * @param name
   * @returns
   */
  async signupOrg(name: string) {
    try {
      // make simple unique org name in keycloak, this name isn't used anywhere else
      const orgName = name.replaceAll(' ', '').slice(0, 5).toLowerCase() + uuidv4().replaceAll('-', '').slice(0, 10);
      const httpClient = await this.keycloakConfig.getHttpClient();
      await httpClient.post(`/organizations/`, { name: orgName, domains: [{ name: orgName }] });
      const orgSearch = await httpClient.get(`/organizations?search=${encodeURIComponent(orgName)}`);
      const organizations = orgSearch.data;
      const organization = organizations.find((org: any) => org.name === orgName);
      return organization.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Adds the user that is signing up to their newly created org as an admin
   * @param user
   * @param orgId
   */
  async signupUser(user: AuthenticatedUser, orgId: string) {
    try {
      const httpClient = await this.keycloakConfig.getHttpClient();
      await httpClient.post(`/organizations/${orgId}/members`, user.id);
      const role = await httpClient.get(`/roles/admin`);
      await httpClient.post(`/users/${user.id}/role-mappings/realm`, [role.data]);
    } catch (error) {
      console.error(error);
    }
  }
}
