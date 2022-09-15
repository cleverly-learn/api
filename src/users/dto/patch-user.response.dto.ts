import { User } from 'users/entities/user.entity';

export class PatchUserResponseDto {
  id?: number;

  firstName?: string;

  lastName?: string;

  patronymic?: string;

  login?: string;

  constructor(user: Partial<User>) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic;
    this.login = user.login;
  }
}
