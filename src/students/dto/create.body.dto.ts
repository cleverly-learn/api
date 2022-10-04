import { CreateUserRequestDto } from 'users/dto/create-user.request.dto';
import { IsGroupExist } from 'groups/validators/is-group-exist/is-group-exist.decorator';
import { IsInt, IsPositive } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class CreateBodyDto extends PickType(CreateUserRequestDto, [
  'firstName',
  'lastName',
  'patronymic',
  'email',
]) {
  @IsGroupExist()
  @IsInt()
  @IsPositive()
  groupId!: number;
}
