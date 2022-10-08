import { Group } from 'groups/entities/group.entity';
import { GroupBaseDto } from 'groups/dto/group-base.dto';
import { Role } from '_common/enums/role.enum';
import { User } from 'users/entities/user.entity';
import { UserBaseDto } from 'users/dto/user-base.dto';

export class UserDto extends UserBaseDto {
  login!: string;

  role!: Role;

  scheduleId?: string;

  group?: GroupBaseDto;

  constructor(
    user: User,
    options: { role: Role; scheduleId?: string; group?: Group },
  ) {
    super(user);
    this.login = user.login;
    this.role = options.role;
    this.scheduleId = options.scheduleId;
    this.group = options.group ? new GroupBaseDto(options.group) : undefined;
  }
}
