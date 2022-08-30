import { Role } from '_common/enums/role.enum';
import { User } from 'users/entities/user.entity';

export class UserDto {
  id!: number;

  email!: string | null;

  isRegistered!: boolean;

  role!: Role;

  firstName!: string;

  lastName!: string;

  patronymic!: string;

  phone!: string | null;

  telegram!: string | null;

  details!: string | null;

  scheduleId!: string | null;

  year!: number | null;

  constructor(user: User) {
    this.id = user.id;
    this.details = user.details;
    this.email = user.email;
    this.phone = user.phone;
    this.telegram = user.telegram;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic;
    this.isRegistered = user.isRegistered;
    this.role = user.isAdmin ? Role.ADMIN : Role.LECTURER;
    this.scheduleId = null;
    this.year = null;
  }
}
