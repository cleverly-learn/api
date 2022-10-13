import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { CourseDto } from 'lecturers/dto/course.dto';
import { CoursesService } from 'courses/courses.service';
import { CreateCourseBodyDto } from 'lecturers/dto/create-course.body.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { LecturerDto } from 'lecturers/dto/lecturer.dto';
import { LecturersService } from 'lecturers/lecturers.service';
import { Page } from '_common/dto/page.dto';
import { PageableDto } from '_common/dto/pageable.dto';
import { Role } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { RolesGuard } from '_common/guards/roles.guard';
import { UserId } from 'auth/decorators/user-id.decorators';
import { ValidateLecturerIdPipe } from 'lecturers/pipes/validate-lecturer-id.pipe';

@Controller('lecturers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Lecturers')
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class LecturersController {
  constructor(
    private readonly lecturersService: LecturersService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get()
  async getAll(@Query() pageable: PageableDto): Promise<Page<LecturerDto>> {
    const [lecturers, totalElements] =
      await this.lecturersService.findAllAndCount(pageable);
    const data = lecturers.map((lecturer) => new LecturerDto(lecturer));
    return new Page({ data, totalElements });
  }

  @Post('sync')
  async synchronize(): Promise<void> {
    await this.lecturersService.synchronize();
  }

  @Get('/export')
  @ApiProperty({ description: 'Export not registered users to excel' })
  @Header('Content-Disposition', 'attachment; filename="Passwords.xlsx"')
  async export(): Promise<StreamableFile> {
    const stream = await this.lecturersService.exportNonRegisteredToExcel();

    return new StreamableFile(stream);
  }

  @Delete(':id')
  delete(@Param('id', ValidateLecturerIdPipe) id: number): Promise<void> {
    return this.lecturersService.delete(id);
  }

  @Roles(Role.LECTURER)
  @Post('me/courses')
  async createCourse(
    @UserId() userId: number,
    @Body() { name, groupsIds, withClassroom }: CreateCourseBodyDto,
  ): Promise<CourseDto> {
    const course = await this.coursesService.create({
      ownerUserId: userId,
      name,
      groupsIds,
      withClassroom: Boolean(withClassroom),
    });
    return new CourseDto(course);
  }
}
