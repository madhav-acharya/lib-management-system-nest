import { IsNumber, IsString } from "class-validator";

export class AddBookDto 
{
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsNumber()
    totalCopies: number;

    @IsNumber()
    available: number;
}