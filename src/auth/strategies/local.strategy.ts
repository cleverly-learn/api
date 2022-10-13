import { AuthService } from 'auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RequestUser } from 'auth/types/request-user.interface';
import { Strategy } from 'passport-local';
import { isNull } from 'lodash';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(email: string, password: string): Promise<RequestUser> {
    const id = await this.authService.validateAndGetUserId(email, password);

    if (isNull(id)) {
      throw new UnauthorizedException();
    }

    return { id };
  }
}
