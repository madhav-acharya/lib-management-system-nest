import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly prismaService: PrismaService) {}

    async createTransaction(transactionData: GenerateTransactionDto) {
        try {
            const transaction = await this.prismaService.transaction.create({
                data: {
                    bookId: transactionData.bookId,
                    memberId: transactionData.memberId,
                    userId: transactionData.userId,
                },
                select: {
                    id: true,
                    bookId: true,
                    memberId: true,
                    userId: true,
                },
            });
            return {
                success: true,
                message: 'Transaction created successfully',
                statusCode: 201,
                data: transaction,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error creating transaction',
                statusCode: 500,
                error: error.message,
            };
        }
    }

    async getTransactions() {
        try {
            const transactions = await this.prismaService.transaction.findMany({
                include: {
                    book: true,
                    member: true,
                    user: true,
                },
            });
            return {
                success: true,
                message: 'Transactions retrieved successfully',
                statusCode: 200,
                data: transactions,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error retrieving transactions',
                statusCode: 500,
                error: error.message,
            };
        }
    }
}
