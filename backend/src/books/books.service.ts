import { Injectable } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BooksService {

    constructor(private prismaService: PrismaService) {}

    async addBook(data: AddBookDto, userId: number)
    {
        try {
            const book = await this.prismaService.book.create({
            data: {
                title: data.title,
                author: data.author,
                userId: userId,
                totalCopies: data.totalCopies,
                available: data.available
            },
            select: {
                id: true,
                title: true,
                author: true,
                userId: true,
                totalCopies: true,
                available: true,
            }
        })
        return{
            success: true,
            message: 'Book added successfully',
            statusCode: 201,
            data: book
        }
        } catch (error) {
            return {
                success: false,
                message: 'Error adding book',
                statusCode: 500,
                error: error.message,
            };
            
        }
        
    }

    async getAllBooks(userId: number) {
        try {
        const books = await this.prismaService.book.findMany({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
            });
            return {
            success: true,
            message: 'Books retrieved successfully',
            statusCode: 200,
            data: books,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error retrieving books',
                statusCode: 500,
                error: error.message,
            };
            
        }
    
  }
}
