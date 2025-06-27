import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class MembersService {
    constructor(private readonly prismaService: PrismaService) {}

    async createMember(memberData: AddMemberDto, userId: number) {
        try {
            const memberExists = await this.prismaService.member.findFirst({
                where: {
                    email: memberData.email,
                    userId: userId,
                },
            });
            if (memberExists) {
                return {
                    success: false,
                    message: 'Member with this email already exists in this library',
                    statusCode: 400,
                };
            }
            const member = await this.prismaService.member.create({
                data: {
                    name: memberData.name,
                    email: memberData.email,
                    phoneNumber: memberData.phoneNumber,
                    address: memberData.address,
                    userId: userId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    address: true,
                },
            });
            return {
                success: true,
                message: 'Member created successfully',
                statusCode: 201,
                data: member,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error creating member',
                statusCode: 500,
            };
        }
    }

    async getMembers(userId: number) {
        try {
            const members = await this.prismaService.member.findMany({
                where: {
                    userId: userId
                },
                include: {
                    user: true,
                },
            });
            return {
                success: true,
                message: 'Members retrieved successfully',
                statusCode: 200,
                data: members,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error retrieving members',
                statusCode: 500,
            };
            
        }
        
    }

    async deleteMemberById(id: number) {
        try {
            const memberExists = await this.prismaService.member.findUnique({
                where: {
                    id: id,
                },
            });
            if (!memberExists) {
                return {
                    success: false,
                    message: 'Member not found',
                    statusCode: 404,
                };
            }

            const transactions = await this.prismaService.transaction.findMany({
                where: {
                    memberId: id,
                },
            });
            if (transactions) {
                await this.prismaService.transaction.deleteMany({
                    where: {
                        memberId: id,
                    },
                });
            }
            const member = await this.prismaService.member.delete({
                where: {
                    id: id,
                },
            });
            return {
                success: true,
                message: `Member with ID ${id} linked with ${transactions.length} transactions deleted successfully`,
                statusCode: 200,
                data: member,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error deleting member',
                statusCode: 500,
            };
        }
    }
}
