import { Group } from 'groups/entities/group.entity';
import { GroupBaseDto } from 'groups/dto/group-base.dto';
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

  group?: GroupBaseDto;

  constructor(student: PatchEntity) {
    super();
    this.id = student.id;
    this.firstName = student.user?.firstName;
    this.lastName = student.user?.lastName;
    this.patronymic = student.user?.patronymic;
    this.group = student.group ? new GroupBaseDto(student.group) : undefined;
  }
}
