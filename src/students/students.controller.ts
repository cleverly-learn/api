import { Body, Controller, Post } from '@nestjs/common';
import { CreateBodyDto } from 'students/dto/create.body.dto';
import { Role } from '_common/enums/role.enum';
import { StudentsService } from 'students/students.service';
import { UserDto } from 'users/dto/user.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() body: CreateBodyDto): Promise<UserDto> {
    const student = await this.studentsService.create(body);
    return new UserDto(student.user, {
      role: Role.STUDENT,
      scheduleId: student.group.scheduleId,
    });
  }
}
