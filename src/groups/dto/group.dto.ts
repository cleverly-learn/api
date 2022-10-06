import { FacultyDto } from 'faculties/dto/faculty.dto';
import { Group } from 'groups/entities/group.entity';

export class GroupDto {
  id!: number;

  name!: string;

  scheduleId!: string;

  faculty!: FacultyDto;

  constructor(group: Group) {
    this.id = group.id;
    this.faculty = new FacultyDto(group.faculty);
    this.name = group.name;
    this.scheduleId = group.scheduleId;
  }
}
