import { AuthService } from 'auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SafeUser } from 'users/types/safe-user.type';
import { Strategy } from 'passport-local';

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
