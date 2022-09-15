import { AuthService } from 'auth/auth.service';
import { Test } from '@nestjs/testing';
import { UsersController } from 'users/users.controller';
import { UsersService } from 'users/users.service';
import { mockProvider } from '_common/utils/test-helpers';

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
      AuthService.hash = jest.fn().mockResolvedValue(hash);
      const dto = {
        firstName: 'hello',
        password: 'test',
      };
      usersService.patch = jest.fn().mockReturnValue({});
      const patchSpy = jest.spyOn(usersService, 'patch');

      await usersController.patchCurrentUser(1, dto);

      expect(patchSpy).toBeCalledWith(1, {
        ...dto,
        password: hash,
      });
    });
  });
});
