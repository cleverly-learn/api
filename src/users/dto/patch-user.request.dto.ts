import { CreateUserRequestDto } from 'users/dto/create-user.request.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchUserRequestDto extends PartialType(
  PickType(CreateUserRequestDto, [
    'firstName',
    'lastName',
    'patronymic',
    'password',
  ]),
) {}
