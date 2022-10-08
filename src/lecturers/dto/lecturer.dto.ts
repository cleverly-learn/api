import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { UserBaseDto } from 'users/dto/user-base.dto';

export class LecturerDto extends UserBaseDto {
  id!: number;

  userId!: number;

  scheduleId!: string;

  constructor(lecturer: Lecturer) {
    super(lecturer.user);
    this.id = lecturer.id;
    this.userId = lecturer.user.id;
    this.scheduleId = lecturer.scheduleId;
  }
}
