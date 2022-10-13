import { Role } from '_common/enums/role.enum';

export interface RequestUser {
  id: number;
  role?: Role;
}
