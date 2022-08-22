import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersServiceMock } from 'users/tests/__mocks__/users.service.mock';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  describe('register', () => {
    it('Expected: hash function accepts password', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      const password = 'mypassword';

      await authService.register({ password } as Omit<User, 'id'>);

      expect(hashSpy).toBeCalledWith('mypassword', expect.anything());
    });

    it('Expected: UsersService accepts hashed password', async () => {
      const expectedPassword = 'hashed';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(expectedPassword as never);
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
