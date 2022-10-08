import { Group } from 'groups/entities/group.entity';
import { GroupBaseDto } from 'groups/dto/group-base.dto';
import { StudentBaseDto } from 'students/dto/student-base.dto';

export class GroupDto extends GroupBaseDto {
  students: StudentBaseDto[];

  constructor(group: Group) {
    super(group);
    this.students = group.students.map(
      (student) => new StudentBaseDto(student),
    );
  }
}
