import { Controller, Body, Post, Get, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser } from 'src/interfaces/req-user.interface';
import { UpdateTransactionDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private transactionService: TransactionsService) {}
    
    @Get('get')
    async getTransactions(@Req() req: ReqUser) {
        const userId = req.user.id;
        return this.transactionService.getTransactions(userId);
    }

    @Post('generate')
    async createTransaction(@Body() transactionData: GenerateTransactionDto, @Req() req: ReqUser) {
        const userId = req.user.id;
        return this.transactionService.createTransaction(transactionData, userId);
    }

    @Patch('update/:id')
    async updateTransactionStatus(@Param('id') id: string, @Body() dto: UpdateTransactionDto)
    {
        return this.transactionService.updateTransactionStatus(dto.status, +id);
    }
}
