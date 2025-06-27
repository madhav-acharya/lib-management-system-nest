import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GenerateTransactionDto } from './dto/generate-transaction.dto';
import { TransactionStatus } from 'src/enums/transaction-status.enums';
import { Cron } from '@nestjs/schedule';

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
                        not: TransactionStatus.RETURNED,
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

    async updateTransactionStatus(status: TransactionStatus, transactionId: number)
    {
        try {
           
            const transaction =  await this.prismaService.transaction.findUnique({
                where: {
                    id: transactionId,
                },
                select: {
                    id: true,
                    status: true,
                    returnDate: true,
                },
            })

            if (!transaction) {
                return {
                    success: false,
                    message: 'Transaction not found',
                    statusCode: 404,
                };
            }
            if (transaction.status === 'RETURNED') {
                return {
                    success: false,
                    message: 'Book already returned',
                    statusCode: 400,
                };
            }

            await this.prismaService.transaction.update({
                where: {
                    id: transactionId,
                },
                data: {
                    status: status,
                    ...(status === TransactionStatus.RETURNED && { returnDate: new Date() }),
                }
            });

            return {
                success: true,
                message: "Book status updated sucessfully",
                statusCode: 200
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error updating transaction status',
                statusCode: 500,
            };
            
        }
    }


    @Cron('0 0 * * *')
    async autoChangeOverdueStatus()
    {
        try {
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

            await this.prismaService.transaction.updateMany({
                where: {
                    status: TransactionStatus.BORROWED,
                    createdAt: {
                        lte: fiveDaysAgo,
                    }
                },
                data: {
                    status: TransactionStatus.OVERDUE,
                }
            })

            return {
                success: true,
                message: 'Transactions updated successfully',
                statusCode: 200,
            };

        } catch (error) {
            
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
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            phoneNumber: true,
                            address: true,
                        },
                    },
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
