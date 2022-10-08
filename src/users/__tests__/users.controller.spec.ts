import { AuthService } from 'auth/auth.service';
import { Group } from 'groups/entities/group.entity';
import { LecturersService } from 'lecturers/lecturers.service';
import { Role } from '_common/enums/role.enum';
import { StudentsService } from 'students/students.service';
import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UserDto } from 'users/dto/user.dto';
import { UsersController } from 'users/users.controller';
import { UsersService } from 'users/users.service';
import { mockProvider } from '_common/utils/test-helpers';
import { omit } from 'lodash';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let lecturersService: LecturersService;
  let studentsService: StudentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        mockProvider(UsersService),
        mockProvider(LecturersService),
        mockProvider(StudentsService),
        mockProvider(AuthService),
        UsersController,
      ],
    }).compile();

    usersController = module.get(UsersController);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
    lecturersService = module.get(LecturersService);
    studentsService = module.get(StudentsService);
  });

  describe('patchCurrentUser', () => {
    it('When: Data provided. Expected: Service called with provided id and hashed user password', async () => {
      const hash = 'hashed';
      const hashSpy = jest.spyOn(AuthService, 'hash').mockResolvedValue(hash);
      const dto = {
        firstName: 'hello',
        password: 'test',
      };
      const patchSpy = jest
        .spyOn(usersService, 'patch')
        .mockResolvedValue({ id: 1 });

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

  describe('get', () => {
    it('When: Role is admin. Expected: User admin dto', async () => {
      authService.getRoleByUserId = jest.fn().mockResolvedValue(Role.ADMIN);
      usersService.findOneById = jest.fn().mockResolvedValue({ name: 'admin' });

      const actual = await usersController.get(1);

      expect(actual).toEqual(
        new UserDto({ name: 'admin' } as unknown as User, { role: Role.ADMIN }),
      );
    });

    it('When: Role is lecturer. Expected: User lecturer dto', async () => {
      authService.getRoleByUserId = jest.fn().mockResolvedValue(Role.LECTURER);
      lecturersService.findOneByUserId = jest
        .fn()
        .mockResolvedValue({ user: { name: 'lecturer' }, scheduleId: 'id' });

      const actual = await usersController.get(1);

      expect(actual).toEqual(
        new UserDto({ name: 'lecturer' } as unknown as User, {
          role: Role.LECTURER,
          scheduleId: 'id',
        }),
      );
    });

    it('When: Role is student. Expected: User student dto', async () => {
      authService.getRoleByUserId = jest.fn().mockResolvedValue(Role.STUDENT);
      studentsService.findOneByUserId = jest.fn().mockResolvedValue({
        user: { name: 'student' },
        group: { scheduleId: 'id', faculty: {} },
      });

      const actual = await usersController.get(1);

      expect(actual).toEqual(
        new UserDto({ name: 'student' } as unknown as User, {
          role: Role.STUDENT,
          scheduleId: 'id',
          group: { scheduleId: 'id', faculty: {} } as Group,
        }),
      );
    });
  });
});
