import { Group } from 'groups/entities/group.entity';
import { OmitType } from '@nestjs/swagger';

export class GroupDto extends OmitType(Group, ['faculty']) {
  faculty!: string;

  constructor(group: Group) {
    super();
    this.id = group.id;
    this.email = group.email;
    this.faculty = group.faculty.name;
    this.name = group.name;
    this.scheduleId = group.scheduleId;
  }
}
