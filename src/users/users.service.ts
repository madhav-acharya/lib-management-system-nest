import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-users.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async createUser(data: CreateUserDto)
    {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await this.prismaService.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: 'USER',
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phoneNumber: true,
                    address: true,
                },
            });
            return {
                success: true,
                message: 'User created successfully',
                statusCode: 201,
                data: user,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error creating user',
                statusCode: 500,
                error: error.message,
            }; 
        }
    }

    async findAllUsers()
    {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phoneNumber: true,
                address: true,
            },
        });
    }
}
