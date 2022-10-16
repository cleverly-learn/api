import { Course } from 'courses/entities/course.entity';
import { UserBaseDto } from 'users/dto/user-base.dto';

export class CourseBaseDto {
  id!: number;

  name!: string;

  classroomLink!: string;

  owner!: UserBaseDto;

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.classroomLink = course.classroomLink;
    this.owner = new UserBaseDto(course.owner.user);
  }
}
