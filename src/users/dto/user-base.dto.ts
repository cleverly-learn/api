import { User } from 'users/entities/user.entity';

export class UserBaseDto {
  id!: number;

  email!: string;

  isRegistered!: boolean;

  firstName!: string;

  lastName!: string;

  patronymic!: string;

  phone!: string;

  telegram!: string;

  details!: string;

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
  }
}
