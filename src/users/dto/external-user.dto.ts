import { Roles } from '../enums/roles.enum';

export interface ExternalUserDTO {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Array<number>;
  address: Array<string>;
  role: Roles;
}
