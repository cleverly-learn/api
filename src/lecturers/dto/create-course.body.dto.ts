import { AreGroupsExist } from 'groups/validators/are-groups-exist/are-groups-exist.decorator';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCourseBodyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @AreGroupsExist()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  groupsIds!: number[];

  @IsOptional()
  @IsBoolean()
  withClassroom?: boolean;
}
