import { Controller, Get, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Post()
    async createMember(addMemberDto: AddMemberDto) {
        return this.membersService.createMember(addMemberDto);
    }

    @Get()
    async getMembers() {
        return this.membersService.getMembers();
    }
}
