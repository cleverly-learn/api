import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageableDto } from '_common/dto/pageable.dto';
import { Role } from '_common/enums/role.enum';
import { Type } from 'class-transformer';
import { getEnumNumericValues } from '_common/utils/get-enum-values';

export class GetAllRequestDto extends PageableDto {
  @ApiProperty({
    description: '0 - Admin, 1 - Lecturer, 2 - Student',
    enum: getEnumNumericValues(Role),
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(Role)
  role?: Role;
}
