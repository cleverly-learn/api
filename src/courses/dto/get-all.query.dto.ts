import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  ownerUserId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  studentUserId?: number;
}
