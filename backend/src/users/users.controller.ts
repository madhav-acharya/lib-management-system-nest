import { Controller, Post, Body, Get, Delete, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-users.dto";

@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService) {}

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get('getAll')
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Get('get/:email')
    async findUserByEmail(@Param('email') email: string) {
        return this.usersService.findUserByEmail(email);
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUserById(parseInt(id));
    }

}
