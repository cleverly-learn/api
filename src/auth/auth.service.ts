import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from 'auth/helpers/jwt-token-payload';
import { LecturersService } from 'lecturers/lecturers.service';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from 'auth/entities/refresh-token.entity';
import { Role } from '_common/enums/role.enum';
import { Symbols, randomString } from '_common/utils/random-string';
import { TokenPairDto } from 'auth/dto/token-pair.dto';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { instanceToPlain } from 'class-transformer';
import { isNull, isUndefined } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly lecturersService: LecturersService,
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
    const defaultName = 'admin';

    const existsDefaultAdmin = await this.usersService.existsByLogin(
      defaultName,
    );

    if (existsDefaultAdmin) {
      return;
    }

    const protectedUser = await AuthService.withHashedPassword({
      login: defaultName,
      password: defaultName,
      firstName: defaultName,
      isAdmin: true,
      isRegistered: true,
    });

    await this.usersService.create(protectedUser);
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

  static async withHashedPassword<T extends Partial<User>>(
    user: T,
  ): Promise<T> {
    if (isUndefined(user.password)) {
      return user;
    }

    return {
      ...user,
      password: await AuthService.hash(user.password),
    };
  }

  static generateLogin(): string {
    return randomString(10, Symbols.LATIN_LETTERS);
  }

  static generatePassword(): string {
    return randomString(10);
  }

  async register(user: Omit<User, 'id'>): Promise<User> {
    const protectedUser = await AuthService.withHashedPassword(user);
    return this.usersService.create(protectedUser);
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
    refreshToken.token = randomString(500);
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

  async removeRefreshToken(token: string): Promise<void> {
    await this.refreshTokensRepository.delete({ token });
  }

  async getRoleByUserId(userId: number): Promise<Role> {
    const [isAdmin, isLecturer] = await Promise.all([
      this.usersService.checkIsAdmin(userId),
      this.lecturersService.existsByUserId(userId),
    ]);
    if (isAdmin) {
      return Role.ADMIN;
    }
    if (isLecturer) {
      return Role.LECTURER;
    }
    return Role.STUDENT;
  }
}
