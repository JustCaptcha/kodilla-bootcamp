import { Roles } from '../enums/roles.enum';

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    address: Array<string>;
    role: Roles;
}
