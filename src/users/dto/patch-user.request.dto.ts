import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchUserRequestDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  patronymic?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  login?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;
}
