import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseDto } from 'courses/dto/course.dto';
import { CoursePreviewDto } from 'courses/dto/course-preview.dto';
import { CoursesService } from 'courses/courses.service';
import { CreateCourseBodyDto } from 'courses/dto/create-course.body.dto';
import { GetAllQueryDto } from 'courses/dto/get-all.query.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Role } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { RolesGuard } from '_common/guards/roles.guard';
import { UserId } from 'auth/decorators/user-id.decorators';
import { ValidateCourseIdPipe } from 'courses/pipes/validate-course-id.pipe';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Courses')
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(Role.LECTURER)
  @Post()
  async createCourse(
    @UserId() userId: number,
    @Body() { name, groupsIds, withClassroom }: CreateCourseBodyDto,
  ): Promise<CoursePreviewDto> {
    const course = await this.coursesService.create({
      ownerUserId: userId,
      name,
      groupsIds,
      withClassroom: Boolean(withClassroom),
    });
    return new CoursePreviewDto(course);
  }

  @Roles(Role.LECTURER)
  @Post(':id/invite')
  async sendInvites(
    @Param('id', ValidateCourseIdPipe) courseId: number,
    @UserId() userId: number,
  ): Promise<void> {
    const course = await this.coursesService.findOneWithGroupsById(courseId);

    if (userId !== course.owner.user.id) {
      throw new ForbiddenException();
    }

    return this.coursesService.inviteStudentsForCourse(course);
  }

  @Roles(Role.LECTURER, Role.STUDENT)
  @Get()
  async getAll(
    @UserId() userId: number,
    @Query() query: GetAllQueryDto,
  ): Promise<CoursePreviewDto[]> {
    if (![query.ownerUserId, query.studentUserId].includes(userId)) {
      throw new ForbiddenException();
    }

    const courses = await this.coursesService.findAll(query);
    return courses.map((course) => new CoursePreviewDto(course));
  }

  @Roles(Role.LECTURER, Role.STUDENT)
  @Get(':id')
  async get(
    @Param('id', ValidateCourseIdPipe) id: number,
    @UserId() userId: number,
  ): Promise<CourseDto> {
    const course = await this.coursesService.findOneWithGroupsById(id);

    const allowedUsers = [
      course.owner.user.id,
      ...course.groups.flatMap(({ students }) =>
        students.map(({ user }) => user.id),
      ),
    ];

    if (!allowedUsers.includes(userId)) {
      throw new ForbiddenException();
    }

    return new CourseDto(course);
  }

  @Roles(Role.LECTURER)
  @Delete(':id')
  async delete(
    @Param('id', ValidateCourseIdPipe) id: number,
    @UserId() userId: number,
  ): Promise<void> {
    const course = await this.coursesService.findOneById(id);

    if (userId !== course.owner.user.id) {
      throw new ForbiddenException();
    }

    return this.coursesService.delete(course);
  }
}
