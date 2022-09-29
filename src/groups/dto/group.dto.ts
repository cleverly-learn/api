import { Group } from 'groups/entities/group.entity';

export class GroupDto {
  id!: number;

  name!: string;

  scheduleId!: string;

  email!: string;

  faculty!: string;

  constructor(group: Group) {
    this.id = group.id;
    this.email = group.email;
    this.faculty = group.faculty.name;
    this.name = group.name;
    this.scheduleId = group.scheduleId;
  }
}
