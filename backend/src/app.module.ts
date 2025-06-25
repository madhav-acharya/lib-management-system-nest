import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), UsersModule, BooksModule, MembersModule, TransactionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
