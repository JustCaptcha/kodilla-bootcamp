import { Roles } from '../enums/roles.enum';

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: Array<string>;
  role: Roles;
}
