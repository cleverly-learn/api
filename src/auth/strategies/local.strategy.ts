import { AuthService } from 'auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { isNull } from 'lodash';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(email: string, password: string): Promise<number> {
    const userId = await this.authService.validateAndGetUserId(email, password);

    if (isNull(userId)) {
      throw new UnauthorizedException();
    }

    return userId;
  }
}
