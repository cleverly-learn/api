import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageableDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  size?: number;
}
