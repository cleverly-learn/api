import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { Strategy } from 'passport-local';
import { SafeUser } from 'users/types/safe-user.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(email: string, password: string): Promise<SafeUser> {
    const user = await this.authService.validateAndGetUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password: userPassword, ...safeUser } = user;

    return safeUser;
  }
}
