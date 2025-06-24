import { Controller, Body, Post, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) {}
    
    @Get()
    async getTransactions() {
        return this.transactionService.getTransactions();
    }

    @Post()
    async createTransaction(@Body() transactionData: GenerateTransactionDto) {
        return this.transactionService.createTransaction(transactionData);
    }
}
