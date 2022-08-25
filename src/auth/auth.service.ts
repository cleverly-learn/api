import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from 'auth/helpers/jwt-token-payload';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from 'auth/entities/refresh-token.entity';
import { TokenPairDto } from 'auth/dto/token-pair.dto';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { instanceToPlain } from 'class-transformer';
import { isNull } from 'lodash';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.createDefaultAdminIfNeeded(),
      this.clearExpiredRefreshTokens(),
    ]);
  }

  async createDefaultAdminIfNeeded(): Promise<void> {
    const existsDefaultAdmin = await this.usersService.existsById(1);

    if (existsDefaultAdmin) {
      return;
    }

    const defaultName = 'admin';

    await this.usersService.put({
      id: 1,
      login: defaultName,
      password: await AuthService.hash(defaultName),
      firstName: defaultName,
      lastName: '',
      patronymic: '',
      email: '',
      isAdmin: true,
      isRegistered: true,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async clearExpiredRefreshTokens(): Promise<void> {
    await this.refreshTokensRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  static hash(str: string): Promise<string> {
    return bcrypt.hash(str, 10);
  }

  async register({ password, ...user }: Omit<User, 'id'>): Promise<User> {
    return this.usersService.create({
      ...user,
      password: await AuthService.hash(password),
    });
  }

  async validateAndGetUserId(
    login: string,
    password: string,
  ): Promise<number | null> {
    const user = await this.usersService.findOneByLogin(login, {
      id: true,
      password: true,
    });

    if (isNull(user)) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    return isValid ? user.id : null;
  }

  async generateTokenPair(userId: number): Promise<TokenPairDto> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    return new TokenPairDto(accessToken, refreshToken);
  }

  generateAccessToken(userId: number): string {
    const payload = new JwtTokenPayload(userId);
    return this.jwtService.sign(instanceToPlain(payload));
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = new RefreshToken();

    refreshToken.userId = userId;
    refreshToken.token = randomUUID();
    refreshToken.expiresAt = addSeconds(
      new Date(),
      +this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    );

    await this.refreshTokensRepository.save(refreshToken);

    return refreshToken.token;
  }

  async refreshTokenPair(refreshToken: string): Promise<TokenPairDto | null> {
    const oldRefreshToken = await this.refreshTokensRepository.findOneBy({
      token: refreshToken,
    });

    if (isNull(oldRefreshToken)) {
      return null;
    }

    await this.refreshTokensRepository.remove(oldRefreshToken);

    if (this.isRefreshTokenExpired(oldRefreshToken.expiresAt)) {
      return null;
    }

    return this.generateTokenPair(oldRefreshToken.userId);
  }

  private isRefreshTokenExpired(expiresAt: Date): boolean {
    return differenceInSeconds(expiresAt, new Date()) <= 0;
  }
}
