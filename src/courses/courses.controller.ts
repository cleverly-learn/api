import { Body, Controller, Post } from '@nestjs/common';
import { CoursesService } from 'courses/courses.service';
import { CreateCourseBodyDto } from 'courses/dto/create-course.body.dto';
import { CreateCourseResponseDto } from 'courses/dto/create-course.response.dto';
import { Role } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { UserId } from 'auth/decorators/user-id.decorators';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(Role.LECTURER)
  @Post()
  async createCourse(
    @UserId() userId: number,
    @Body() { name, groupsIds, withClassroom }: CreateCourseBodyDto,
  ): Promise<CreateCourseResponseDto> {
    const course = await this.coursesService.create({
      ownerUserId: userId,
      name,
      groupsIds,
      withClassroom: Boolean(withClassroom),
    });
    return new CreateCourseResponseDto(course);
  }
}
