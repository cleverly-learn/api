import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PageableDto } from '_common/dto/pageable.dto';
import { Type } from 'class-transformer';

export class GetAllQueryDto extends PageableDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  facultyId?: number;
}
