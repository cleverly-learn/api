import { AuthService } from 'auth/auth.service';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturerDto } from 'schedule/dto/lecturer.dto';
import { User } from 'users/entities/user.entity';

export function mapScheduleDtoToNewLecturer(dto: LecturerDto): Lecturer {
  const entity = new Lecturer();
  entity.scheduleId = dto.id;

  const user = new User();
  const [lastName, firstName, patronymic] = dto.name.split(' ');
  user.login = AuthService.generateLogin();
  user.firstName = firstName;
  user.lastName = lastName;
  user.patronymic = patronymic;
  user.isAdmin = false;
  user.isRegistered = false;

  entity.user = user;

  return entity;
}
