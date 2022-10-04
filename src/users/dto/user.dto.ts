import { Role } from '_common/enums/role.enum';
import { User } from 'users/entities/user.entity';

export class UserDto {
  id!: number;

  login!: string;

  email!: string;

  isRegistered!: boolean;

  role!: Role;

  firstName!: string;

  lastName!: string;

  patronymic!: string;

  phone!: string;

  telegram!: string;

  details!: string;

  scheduleId?: string;

  constructor(user: User, options: { role: Role; scheduleId?: string }) {
    this.id = user.id;
    this.details = user.details;
    this.login = user.login;
    this.email = user.email;
    this.phone = user.phone;
    this.telegram = user.telegram;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic;
    this.isRegistered = user.isRegistered;
    this.role = options.role;
    this.scheduleId = options.scheduleId;
  }
}
