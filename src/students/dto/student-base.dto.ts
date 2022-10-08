import { Student } from 'students/entities/student.entity';
import { UserBaseDto } from 'users/dto/user-base.dto';

export class StudentBaseDto extends UserBaseDto {
  id!: number;

  userId!: number;

  constructor(student: Student) {
    super(student.user);
    this.id = student.id;
    this.userId = student.user.id;
  }
}
