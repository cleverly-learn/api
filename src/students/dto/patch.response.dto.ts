import { Group } from 'groups/entities/group.entity';
import { GroupDto } from 'groups/dto/group.dto';
import { OmitType } from '@nestjs/swagger';
import { PatchBodyDto } from 'students/dto/patch.body.dto';

interface PatchEntity {
  id: number;
  user?: {
    firstName?: string;
    lastName?: string;
    patronymic?: string;
  };
  group?: Group;
}

export class PatchResponseDto extends OmitType(PatchBodyDto, ['groupId']) {
  id!: number;

  group?: GroupDto;

  constructor(student: PatchEntity) {
    super();
    this.id = student.id;
    this.firstName = student.user?.firstName;
    this.lastName = student.user?.lastName;
    this.patronymic = student.user?.patronymic;
    this.group = student.group ? new GroupDto(student.group) : undefined;
  }
}
