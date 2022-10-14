import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CoursePreviewDto } from 'courses/dto/course-preview.dto';
import { CoursesService } from 'courses/courses.service';
import { CreateCourseBodyDto } from 'courses/dto/create-course.body.dto';
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
@Roles(Role.LECTURER)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

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

  @Post(':id/invite')
  async sendInvites(
    @Param('id', ValidateCourseIdPipe) courseId: number,
    @UserId() userId: number,
  ): Promise<void> {
    const course = await this.coursesService.findOneById(courseId);

    if (userId !== course.owner.user.id) {
      throw new ForbiddenException();
    }

    return this.coursesService.inviteStudentsForCourse(course);
  }
}
