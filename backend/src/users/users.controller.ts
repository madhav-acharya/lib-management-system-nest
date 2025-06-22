import { Controller, Post, Body, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-users.dto";

@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    async findAllUsers() {
        return this.usersService.findAllUsers();
    }

}
