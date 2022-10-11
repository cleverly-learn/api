import { AuthService } from 'auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROLES_KEY } from '_common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from '_common/enums/role.enum';
import { isEmpty } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isEmpty(requiredRoles)) {
      return true;
    }

    const { user: userId } = context
      .switchToHttp()
      .getRequest<{ user: number }>();

    const role = await this.authService.getRoleByUserId(userId);

    return requiredRoles.includes(role);
  }
}
