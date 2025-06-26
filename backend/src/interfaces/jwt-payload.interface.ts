import {Role} from '../enums/role.enums';

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
    name: string;
    phoneNumber: string;
    address: string;
}