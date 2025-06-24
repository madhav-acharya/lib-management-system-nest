import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../enums/role.enums';

export class CreateUserDto 
{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsOptional()
    @IsEnum(Role, { message: 'Role must be ADMIN, or SUPERADMIN' })
    role?: Role;

    @MinLength(10, { message: 'Phone number must be at least 10 characters long' })
    phoneNumber: string;

    @IsString()
    address: string;
}
