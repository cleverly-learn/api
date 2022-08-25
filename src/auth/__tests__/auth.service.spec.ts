import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from 'auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'auth/entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { createMock } from '_common/utils/create-mock';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let refreshTokensRepository: Repository<RefreshToken>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: createMock(UsersService),
        },
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: createMock(Repository),
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    refreshTokensRepository = module.get(getRepositoryToken(RefreshToken));
    configService = module.get(ConfigService);
  });

  describe('createDefaultAdminIfNeeded', () => {
    it('Expected: Admin is searched with id 1', async () => {
      const findSpy = jest.spyOn(usersService, 'findOneById');

      await authService.createDefaultAdminIfNeeded();

      expect(findSpy).toBeCalledWith(1);
    });

    it('When: Admin exists. Expected: New user is not created', async () => {
      usersService.findOneById = jest.fn().mockResolvedValue({});
      const createSpy = jest.spyOn(usersService, 'put');

      await authService.createDefaultAdminIfNeeded();

      expect(createSpy).not.toBeCalled();
    });

    it('When: Admin is not exists. Expected: New user created', async () => {
      usersService.findOneById = jest.fn().mockResolvedValue(null);
      const createSpy = jest.spyOn(usersService, 'put');

      await authService.createDefaultAdminIfNeeded();

      expect(createSpy).toBeCalled();
    });
  });

  describe('register', () => {
    it('Expected: hash function accepts password', async () => {
      const hashSpy = jest.spyOn(AuthService, 'hash');
      const password = 'mypassword';

      await authService.register({ password } as Omit<User, 'id'>);

      expect(hashSpy).toBeCalledWith(password);
    });

    it('Expected: UsersService accepts hashed password', async () => {
      const expectedPassword = 'hashed';
      AuthService.hash = jest.fn().mockResolvedValue(expectedPassword);
      const createSpy = jest.spyOn(usersService, 'create');

      await authService.register({
        firstName: 'hello',
        password: 'world',
      } as Omit<User, 'id'>);

      expect(createSpy).toBeCalledWith({
        firstName: 'hello',
        password: expectedPassword,
      });
    });
  });

  describe('validateAndGetUser', () => {
    it('Expected: Correct arguments passed', async () => {
      const comparePassword = 'compare';
      usersService.findOneByLogin = jest
        .fn()
        .mockResolvedValue({ password: comparePassword });
      const findSpy = jest.spyOn(usersService, 'findOneByLogin');
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      const login = 'login';
      const password = 'password';

      await authService.validateAndGetUserId(login, password);

      expect(findSpy).toBeCalledWith(login, { id: true, password: true });
      expect(compareSpy).toBeCalledWith(password, comparePassword);
    });

    it('When: User is not found. Expected: null', async () => {
      usersService.findOneByLogin = jest.fn().mockResolvedValue(null);

      const actual = await authService.validateAndGetUserId('test', 'test');

      expect(actual).toBeNull();
    });

    it('When: User is not valid. Expected: null', async () => {
      usersService.findOneByLogin = jest.fn().mockResolvedValue({});
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(false as never);

      const actual = await authService.validateAndGetUserId('test', 'test');

      expect(compareSpy).toBeCalled();
      expect(actual).toBeNull();
    });

    it('When: User valid. Expected: User id', async () => {
      usersService.findOneByLogin = jest.fn().mockResolvedValue({ id: 1 });
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);

      const actual = await authService.validateAndGetUserId('test', 'test');

      expect(compareSpy).toBeCalled();
      expect(actual).toEqual(1);
    });
  });

  describe('generateAccessToken', () => {
    it('When: userId provided. Expected: JWT sign accepts payload, returns token', () => {
      const expected = 'token';
      jwtService.sign = jest.fn().mockReturnValue(expected);
      const signSpy = jest.spyOn(jwtService, 'sign');

      const actual = authService.generateAccessToken(1);

      expect(signSpy).toBeCalledWith({ sub: 1 });
      expect(actual).toBe(expected);
    });
  });

  describe('generateRefreshToken', () => {
    it('When: userId provided. Expected: Token saved and returned', async () => {
      const testDate = new Date('2000-01-01 00:00:00');
      jest.useFakeTimers().setSystemTime(testDate);
      const saveSpy = jest.spyOn(refreshTokensRepository, 'save');
      configService.get = jest.fn().mockReturnValue('86400');
      const expected = 'test-token';
      jest.spyOn(crypto, 'randomUUID').mockReturnValue(expected);

      const actual = await authService.generateRefreshToken(1);

      expect(saveSpy).toBeCalledWith({
        userId: 1,
        token: expected,
        expiresAt: new Date('2000-01-02 00:00:00'),
      });
      expect(actual).toBe(expected);
    });
  });

  describe('generateTokenPair', () => {
    it('Expected: Tokens pair', async () => {
      authService.generateAccessToken = jest.fn().mockReturnValue('token1');
      authService.generateRefreshToken = jest.fn().mockResolvedValue('token2');
      const accessSpy = jest.spyOn(authService, 'generateAccessToken');
      const refreshSpy = jest.spyOn(authService, 'generateRefreshToken');

      const actual = await authService.generateTokenPair(1);

      expect(accessSpy).toBeCalledWith(1);
      expect(refreshSpy).toBeCalledWith(1);
      expect(actual).toEqual({
        accessToken: 'token1',
        refreshToken: 'token2',
      });
    });
  });
});
