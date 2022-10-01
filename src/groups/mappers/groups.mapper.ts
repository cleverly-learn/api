import { Faculty } from 'groups/entities/faculty.entity';
import { Group } from 'groups/entities/group.entity';
import { GroupDto } from 'schedule/dto/group.dto';

export function mapScheduleDtoToEntity(dto: GroupDto): Group {
  const group = new Group();
  group.scheduleId = dto.id;
  group.name = dto.name;

  const faculty = new Faculty();
  faculty.name = dto.faculty;

  group.faculty = faculty;

  return group;
}
