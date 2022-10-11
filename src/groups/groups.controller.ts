import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetAllQueryDto } from 'groups/dto/get-all.query.dto';
import { GroupDto } from 'groups/dto/group.dto';
import { GroupPreviewDto } from 'groups/dto/group-preview.dto';
import { GroupsService } from 'groups/groups.service';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Page } from '_common/dto/page.dto';
import { Role } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { ValidateGroupIdPipe } from 'groups/pipes/validate-group-id.pipe';

@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiTags('Groups')
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Roles(Role.ADMIN)
  @Post('/sync')
  async synchronize(): Promise<void> {
    await this.groupsService.synchronize();
  }

  @Get()
  async getAll(@Query() query: GetAllQueryDto): Promise<Page<GroupPreviewDto>> {
    const [groups, totalElements] = await this.groupsService.findAllAndCount(
      query,
    );
    const dtos = groups.map((group) => new GroupPreviewDto(group));

    return new Page({ data: dtos, totalElements });
  }

  @Get(':id')
  async get(@Param('id', ValidateGroupIdPipe) id: number): Promise<GroupDto> {
    const group = await this.groupsService.findOneWithStudentsById(id);
    return new GroupDto(group);
  }
}
