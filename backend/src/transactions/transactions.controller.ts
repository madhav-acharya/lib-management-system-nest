import { Controller, Body, Post, Get, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser } from 'src/interfaces/req-user.interface';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) {}
    
    @Get()
    async getTransactions() {
        return this.transactionService.getTransactions();
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createTransaction(@Body() transactionData: GenerateTransactionDto, @Req() req: ReqUser) {
        const userId = req.user.id;
        return this.transactionService.createTransaction(transactionData, userId);
    }
}
