import { AuthService } from 'auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtTokenPayload } from 'auth/helpers/jwt-token-payload';
import { PassportStrategy } from '@nestjs/passport';
import { RequestUser } from 'auth/types/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtTokenPayload): Promise<RequestUser> {
    const userId = payload.sub;
    const role = await this.authService.getRoleByUserId(userId);
    return {
      id: userId,
      role,
    };
  }
}
