import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class AddMemberDto {
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;

    @MinLength(10, { message: 'Phone number must be at least 10 characters long' })
    phoneNumber: string;
    
    @IsString()
    address: string;

    @IsNumber()
    userId: number;
}