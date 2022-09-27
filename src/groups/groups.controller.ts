import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { GroupDto } from 'groups/dto/group.dto';
import { GroupsService } from 'groups/groups.service';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiTags('Groups')
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/sync')
  async synchronize(): Promise<GroupDto[]> {
    const groups = await this.groupsService.synchronize();
    return groups.map((group) => new GroupDto(group));
  }
}
