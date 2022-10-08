import { GroupBaseDto } from 'groups/dto/group-base.dto';
import { Student } from 'students/entities/student.entity';
import { StudentBaseDto } from 'students/dto/student-base.dto';

export class StudentDto extends StudentBaseDto {
  group!: GroupBaseDto;

  constructor(student: Student) {
    super(student);
    this.group = new GroupBaseDto(student.group);
  }
}
