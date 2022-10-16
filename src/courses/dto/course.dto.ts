import { Course } from 'courses/entities/course.entity';
import { CourseBaseDto } from 'courses/dto/course-base.dto';
import { GroupDto } from 'groups/dto/group.dto';

export class CourseDto extends CourseBaseDto {
  groups!: GroupDto[];

  constructor(course: Course) {
    super(course);
    this.groups = course.groups.map((group) => new GroupDto(group));
  }
}
