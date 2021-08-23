import { Roles } from 'src/shared/enums/roles.enum';

export interface ExternalUserDTO {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Array<number>;
  address?: Array<ExternalUserAddressDTO>;
  role: Roles;
}

export class ExternalUserAddressDTO {
  country: string;
  city: string;
  street: string;
  number: number;
}
