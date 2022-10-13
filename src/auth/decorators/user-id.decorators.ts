import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestUser } from 'auth/types/request-user.interface';

/**
 * Fetches user id from request.
 *
 * @example
 * (@)Get()
 * async getData(@UserId() userId: number) {}
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return request.user.id;
  },
);
