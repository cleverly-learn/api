import { GroupDto } from 'groups/dto/group.dto';
import { Student } from 'students/entities/student.entity';

export class StudentDto {
  id!: number;

  email!: string;

  isRegistered!: boolean;

  firstName!: string;

  lastName!: string;

  patronymic!: string;

  phone!: string;

  telegram!: string;

  details!: string;

  group!: GroupDto;

  constructor(student: Student) {
    this.id = student.id;
    this.email = student.user.email;
    this.isRegistered = student.user.isRegistered;
    this.firstName = student.user.firstName;
    this.lastName = student.user.lastName;
    this.patronymic = student.user.patronymic;
    this.phone = student.user.phone;
    this.telegram = student.user.telegram;
    this.details = student.user.details;
    this.group = new GroupDto(student.group);
  }
}
