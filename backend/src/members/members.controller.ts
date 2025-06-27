import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReqUser } from 'src/interfaces/req-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Post('add')
    async createMember(@Body() addMemberDto: AddMemberDto, @Req() req: ReqUser) {
        const userId = req.user.id;
        return this.membersService.createMember(addMemberDto, userId);
    }

    @Get('getAll')
    async getMembers(@Req() req: ReqUser) {
        const userId = req.user.id;
        return this.membersService.getMembers(userId);
    }
}
