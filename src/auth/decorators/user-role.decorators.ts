import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestUser } from 'auth/types/request-user.interface';

/**
 * Fetches user role from request.
 *
 * @example
 * (@)Get()
 * async getData(@UserRole() role: Role) {}
 */
export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return request.user.role;
  },
);
