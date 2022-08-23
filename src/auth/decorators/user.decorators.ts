import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Fetches SafeUser from request.
 *
 * @example
 * (@)Get()
 * async getData(@User() user: SafeUser) {}
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
