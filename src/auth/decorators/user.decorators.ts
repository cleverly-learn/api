import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Fetches user id from request.
 *
 * @example
 * (@)Get()
 * async getData(@UserId() userId: number) {}
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: number }>();
    return request.user;
  },
);
