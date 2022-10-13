import { Course } from 'courses/entities/course.entity';
import { GroupDto } from 'groups/dto/group.dto';

export class CourseDto {
  id!: number;

  name!: string;

  classroomLink!: string;

  groups!: GroupDto[];

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.classroomLink = course.classroomLink;
    this.groups = course.groups.map((group) => new GroupDto(group));
  }
}
