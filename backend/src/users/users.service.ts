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
                    role: data.role,
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
            }; 
        }
    }

    async findAllUsers()
    {
        try {
            const users = await this.prismaService.user.findMany({
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
            message: 'Users retrieved successfully',
            statusCode: 200,
            data: users,
        };
        } catch (error) {
            return {
                success: false,
                message: 'Error retrieving users',
                statusCode: 500,
            };
            
        }
        
    }

    async deleteUserById(userId: number) {
        try {
            const user = await this.prismaService.user.delete({
                where: { id: userId },
            });
            return {
                success: true,
                message: 'User deleted successfully',
                statusCode: 200,
                data: user,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error deleting user',
                statusCode: 500,
            };
        }
    }

    async findUserByEmail(email: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phoneNumber: true,
                    address: true,
                    password: true,
                },
            });
            return {
                success: true,
                message: 'User found successfully',
                statusCode: 200,
                data: user,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error finding user',
                statusCode: 500,
            };
        }
    }
}
