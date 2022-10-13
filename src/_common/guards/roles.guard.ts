import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLES_KEY } from '_common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { RequestUser } from 'auth/types/request-user.interface';
import { Role } from '_common/enums/role.enum';
import { isEmpty } from 'lodash';
import { isNotUndefined } from '_common/utils/is-not-undefined';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isEmpty(requiredRoles)) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: RequestUser }>();

    return isNotUndefined(user.role) && requiredRoles.includes(user.role);
  }
}
