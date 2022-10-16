import { Course } from 'courses/entities/course.entity';
import { CourseBaseDto } from 'courses/dto/course-base.dto';
import { GroupBaseDto } from 'groups/dto/group-base.dto';

export class CoursePreviewDto extends CourseBaseDto {
  groups!: GroupBaseDto[];

  constructor(course: Course) {
    super(course);
    this.groups = course.groups.map((group) => new GroupBaseDto(group));
  }
}
