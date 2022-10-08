import { Group } from 'groups/entities/group.entity';
import { GroupBaseDto } from 'groups/dto/group-base.dto';

export class GroupPreviewDto extends GroupBaseDto {
  studentsCount!: number;

  constructor(group: Group) {
    super(group);
    this.studentsCount = group.students.length;
  }
}
