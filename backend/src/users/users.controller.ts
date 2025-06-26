import { Controller, Post, Body, Get, Delete, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/enums/role.enums";

@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN)
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
