import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { createMock } from '_common/utils/create-mock';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: createMock(UsersService),
        },
        AuthService,
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
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
});
