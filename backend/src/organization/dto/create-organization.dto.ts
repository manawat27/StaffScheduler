import { PickType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class CreateOrganizationDto extends PickType(OrganizationDto, ['id', 'name', 'assets_folder', 'theme']) {}
