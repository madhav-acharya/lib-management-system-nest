import { IsEnum } from 'class-validator';
import { TransactionStatus } from 'src/enums/transaction-status.enums';

export class UpdateTransactionDto {
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
