import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CourseDto } from 'courses/dto/course.dto';
import { CoursesService } from 'courses/courses.service';
import { CreateCourseBodyDto } from 'courses/dto/create-course.body.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Role } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { RolesGuard } from '_common/guards/roles.guard';
import { UserId } from 'auth/decorators/user-id.decorators';

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
