import { IsNotEmpty, IsString } from 'class-validator';

export class PatchCurrentUserRequestDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  patronymic?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;
}
