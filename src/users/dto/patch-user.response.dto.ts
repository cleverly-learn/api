import { OmitType } from '@nestjs/swagger';
import { PatchUserRequestDto } from 'users/dto/patch-user.request.dto';
import { User } from 'users/entities/user.entity';

export class PatchUserResponseDto extends OmitType(PatchUserRequestDto, [
  'password',
]) {
  id!: number;

  constructor(user: Partial<User> & Pick<User, 'id'>) {
    super();
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.patronymic = user.patronymic;
  }
}
