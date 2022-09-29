import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '_common/enums/role.enum';
import { Type } from 'class-transformer';
import { getEnumNumericValues } from '_common/utils/get-enum-values';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsBoolean()
  isRegistered!: boolean;

  @ApiProperty({
    description: '0 - Admin, 1 - Lecturer, 2 - Student',
    enum: getEnumNumericValues(Role),
  })
  @Type(() => Number)
  @IsEnum(Role)
  role!: Role;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  patronymic!: string;
}
