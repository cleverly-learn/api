import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsBoolean()
  isRegistered!: boolean;

  @IsBoolean()
  isAdmin!: boolean;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  patronymic!: string;
}
