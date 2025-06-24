import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class MembersService {
    constructor(private readonly prismaService: PrismaService) {}

    async createMember(memberData: AddMemberDto) {
        try {
            const member = await this.prismaService.member.create({
                data: {
                    name: memberData.name,
                    email: memberData.email,
                    phoneNumber: memberData.phoneNumber,
                    address: memberData.address,
                    userId: memberData.userId,
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
                error: error.message,
            };
        }
    }

    async getMembers() {
        try {
            const members = await this.prismaService.member.findMany();
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
                error: error.message,
            };
            
        }
        
    }
}
