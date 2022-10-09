import { CreateUserRequestDto } from 'users/dto/create-user.request.dto';
import { IsMobilePhone, IsOptional, IsString } from 'class-validator';
import { PartialType, PickType } from '@nestjs/swagger';

export class PatchUserRequestDto extends PartialType(
  PickType(CreateUserRequestDto, [
    'firstName',
    'lastName',
    'patronymic',
    'password',
  ]),
) {
  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsMobilePhone('uk-UA')
  phone?: string;

  @IsOptional()
  @IsString()
  details?: string;
}
