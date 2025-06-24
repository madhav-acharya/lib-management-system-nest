import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TransactionStatus } from '../../enums/transaction-status.enums';

export class GenerateTransactionDto {
    @IsNumber()
    bookId: number;

    @IsNumber()
    memberId: number;

    @IsNumber()
    userId: number;

    @IsEnum(TransactionStatus)
    @IsOptional()
    status?: TransactionStatus;

    @IsDateString()
    @IsOptional()
    returnDate?: string;
}