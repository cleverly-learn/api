import { Course } from 'courses/entities/course.entity';
import { GroupBaseDto } from 'groups/dto/group-base.dto';

export class CoursePreviewDto {
  id!: number;

  name!: string;

  classroomLink!: string;

  groups!: GroupBaseDto[];

  constructor(course: Course) {
    this.id = course.id;
    this.name = course.name;
    this.classroomLink = course.classroomLink;
    this.groups = course.groups.map((group) => new GroupBaseDto(group));
  }
}
