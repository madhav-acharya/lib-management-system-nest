import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private readonly prismaService: PrismaService) {}

    async createTransaction(transactionData: GenerateTransactionDto, userId: number) {
        try {
            const transactionCount = await this.prismaService.transaction.count({
                where: {
                    userId: userId,
                    memberId: transactionData.memberId,
                    status: {
                        not: 'RETURNED',
                    }
                },
            });

            if (transactionCount > 6) {
                return {
                    success: false,
                    message: 'Book borrowing limit exceeded for this member',
                    statusCode: 400,
                };
            }
            const book = await this.prismaService.book.findUnique({
                where: {
                    id: transactionData.bookId,
                },
                select: {
                    id: true,
                    available: true,
                }
            });
            if (!book || book.available <= 0) {
                return {
                    success: false,
                    message: 'Book not found or no stock available',
                    statusCode: 404,
                };
            }
            const transaction = await this.prismaService.transaction.create({
                data: {
                    bookId: transactionData.bookId,
                    memberId: transactionData.memberId,
                    userId: userId,
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
            };
        }
    }

    async getTransactions(userId: number) {
        try {
            const transactions = await this.prismaService.transaction.findMany({
                where: {
                    userId: userId
                },
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
            };
        }
    }
}
