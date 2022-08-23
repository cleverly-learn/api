import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { randomUUID } from 'crypto';
import { addSeconds } from 'date-fns';
import { LessThan, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtTokenPayload } from './helpers/jwt-token-payload';
import { TokenPair } from './helpers/token-pair';

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
    const defaultAdmin = await this.usersService.findOneById(1);

    if (defaultAdmin) {
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

  async validateAndGetUser(
    login: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneByLogin(login);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    return isValid ? user : null;
  }

  async generateTokenPair(userId: number): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId);

    return new TokenPair(accessToken, refreshToken);
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
}
