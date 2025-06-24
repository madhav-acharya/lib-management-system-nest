import { Controller, Post, Body, Get } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
    constructor(private bookService: BooksService) {}

    @Post()
    async createBook(@Body() addBookDto: AddBookDto) {
        return await this.bookService.addBook(addBookDto);
    }

    @Get()
    async getAllBooks() {
        return await this.bookService.getAllBooks();
    }

}
