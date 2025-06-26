import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser } from 'src/interfaces/req-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService) {}

    @Post()
    async createBook(@Body() addBookDto: AddBookDto, @Req() req: ReqUser) {
        const userId = req.user.id;
        return await this.bookService.addBook(addBookDto, userId);
    }

    @Get()
    async getAllBooks(@Req() req: ReqUser) {
        const userId = req.user.id;
        return await this.bookService.getAllBooks(userId);
    }

}
