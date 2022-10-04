import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetAllQueryDto } from 'groups/dto/get-all.query.dto';
import { GroupDto } from 'groups/dto/group.dto';
import { GroupsService } from 'groups/groups.service';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Page } from '_common/dto/page.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiTags('Groups')
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/sync')
  async synchronize(): Promise<void> {
    await this.groupsService.synchronize();
  }

  @Get()
  async getAll(@Query() query: GetAllQueryDto): Promise<Page<GroupDto>> {
    const [groups, totalElements] = await this.groupsService.findAllAndCount(
      query,
    );
    const dtos = groups.map((group) => new GroupDto(group));

    return new Page({ data: dtos, totalElements });
  }
}
