import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto 
{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsOptional()
    role?: string;

    @IsOptional()
    @MinLength(10, { message: 'Phone number must be at least 10 characters long' })
    phoneNumber?: string;

    address?: string;
}
