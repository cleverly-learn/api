import { AuthService } from 'auth/auth.service';
import { Role } from '_common/enums/role.enum';
import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersController } from 'users/users.controller';
import { UsersService } from 'users/users.service';
import { mockProvider } from '_common/utils/test-helpers';
import { omit } from 'lodash';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [mockProvider(UsersService), UsersController],
    }).compile();

    usersController = module.get(UsersController);
    usersService = module.get(UsersService);
  });

  describe('patchCurrentUser', () => {
    it('When: Data provided. Expected: Service called with provided id and hashed user password', async () => {
      const hash = 'hashed';
      const hashSpy = jest.spyOn(AuthService, 'hash').mockResolvedValue(hash);
      const dto = {
        firstName: 'hello',
        password: 'test',
      };
      const patchSpy = jest.spyOn(usersService, 'patch').mockResolvedValue({});

      await usersController.patchCurrentUser(1, dto);

      expect(hashSpy).toBeCalledWith(dto.password);
      expect(patchSpy).toBeCalledWith(1, {
        ...dto,
        password: hash,
      });
    });
  });

  describe('create', () => {
    it('When: Data provided. Expected: Service called with random login and hashed user password', async () => {
      const hash = 'hashed';
      const hashSpy = jest.spyOn(AuthService, 'hash').mockResolvedValue(hash);
      const login = 'randomLogin';
      const generateLoginSpy = jest
        .spyOn(AuthService, 'generateLogin')
        .mockReturnValue(login);
      const dto = {
        password: 'password',
        email: 'email',
        isRegistered: true,
        role: Role.ADMIN,
        firstName: 'first',
        lastName: 'last',
        patronymic: 'patron',
      };
      const createSpy = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue({} as User);

      await usersController.create(dto);

      expect(hashSpy).toBeCalledWith(dto.password);
      expect(generateLoginSpy).toBeCalled();
      expect(createSpy).toBeCalledWith({
        ...omit(dto, 'role'),
        login,
        password: hash,
        isAdmin: true,
      });
    });
  });
});
