import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GroupDto } from 'groups/dto/group.dto';
import { GroupsService } from 'groups/groups.service';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Page } from '_common/dto/page.dto';
import { PageableDto } from '_common/dto/pageable.dto';

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

  @Get()
  async getAll(@Query() pageable: PageableDto): Promise<Page<GroupDto>> {
    const [groups, totalElements] = await this.groupsService.findAllAndCount(
      pageable,
    );
    const dtos = groups.map((group) => new GroupDto(group));

    return new Page({ data: dtos, totalElements });
  }
}
