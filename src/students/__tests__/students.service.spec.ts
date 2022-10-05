import { AuthService } from 'auth/auth.service';
import { Group } from 'groups/entities/group.entity';
import { GroupsService } from 'groups/groups.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Student } from 'students/entities/student.entity';
import { StudentsRepository } from 'students/repositories/students.repository';
import { StudentsService } from 'students/students.service';
import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import {
  mockProvider,
  mockRepositoryProvider,
} from '_common/utils/test-helpers';
import { omit } from 'lodash';

describe('StudentsService', () => {
  let studentsService: StudentsService;
  let usersService: UsersService;
  let studentsRepository: StudentsRepository;
  let mailerService: MailerService;
  let groupsService: GroupsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StudentsService,
        mockProvider(UsersService),
        mockProvider(MailerService),
        mockProvider(GroupsService),
        mockRepositoryProvider(StudentsRepository),
      ],
    }).compile();

    studentsService = module.get(StudentsService);
    usersService = module.get(UsersService);
    mailerService = module.get(MailerService);
    groupsService = module.get(GroupsService);
    studentsRepository = module.get(StudentsRepository);
  });

  describe('create', () => {
    it('When: Email provided. Expected: User created and invite sent', async () => {
      AuthService.generateLogin = jest.fn().mockReturnValue('login');
      AuthService.generatePassword = jest.fn().mockReturnValue('password');
      const withHashedSpy = jest
        .spyOn(AuthService, 'withHashedPassword')
        .mockResolvedValue({ test: 'hashed' } as unknown as User);
      const userCreateSpy = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue({ test: 'user' } as unknown as User);
      const groupFindSpy = jest
        .spyOn(groupsService, 'findOneById')
        .mockResolvedValue({ test: 'group' } as unknown as Group);
      const mailerSpy = jest.spyOn(mailerService, 'sendMail');
      const studentCreateSpy = jest
        .spyOn(studentsRepository, 'save')
        .mockResolvedValue({ test: 'student' } as unknown as Student);
      const params = {
        firstName: 'first',
        lastName: 'last',
        patronymic: 'pat',
        email: 'email@test.com',
        groupId: 1,
      };

      const actual = await studentsService.create(params);

      expect(withHashedSpy).toBeCalledWith({
        ...omit(params, ['groupId']),
        login: 'login',
        password: 'password',
        isAdmin: false,
        isRegistered: false,
      });
      expect(userCreateSpy).toBeCalledWith({ test: 'hashed' });
      expect(groupFindSpy).toBeCalledWith(1);
      expect(mailerSpy).toBeCalledWith({
        to: params.email,
        subject: 'Логін та пароль для реєстрації',
        text: `Логін: login\nПароль: password`,
      });
      expect(studentCreateSpy).lastCalledWith({
        user: { test: 'user' },
        group: { test: 'group' },
      });
      expect(actual).toEqual({ test: 'student' });
    });
  });

  describe('patch', () => {
    it('When: Only user data provided. Expected: Only user updated', async () => {
      const findUserIdSpy = jest
        .spyOn(studentsRepository, 'findUserIdByStudentId')
        .mockResolvedValue(5);
      const findGroupSpy = jest.spyOn(groupsService, 'findOneById');
      const saveStudentSpy = jest.spyOn(studentsRepository, 'save');
      const userData = {
        firstName: 'name',
        lastName: 'last',
        patronymic: 'patro',
      };
      const patchUserSpy = jest.spyOn(usersService, 'patch').mockResolvedValue({
        ...userData,
        id: 5,
      });

      const actual = await studentsService.patch(1, {
        firstName: 'name',
        lastName: 'last',
        patronymic: 'patro',
      });

      expect(findUserIdSpy).toBeCalledWith(1);
      expect(findGroupSpy).not.toBeCalled();
      expect(saveStudentSpy).not.toBeCalled();
      expect(patchUserSpy).toBeCalledWith(5, userData);
      expect(actual).toEqual({
        id: 1,
        user: {
          id: 5,
          ...userData,
        },
      });
    });

    it('When: Only group id provided. Expected: Only group updated', async () => {
      const findUserIdSpy = jest.spyOn(
        studentsRepository,
        'findUserIdByStudentId',
      );
      const group = {
        id: 2,
        scheduleId: 'test',
      } as unknown as Group;
      const findGroupSpy = jest
        .spyOn(groupsService, 'findOneById')
        .mockResolvedValue(group);
      const saveStudentSpy = jest
        .spyOn(studentsRepository, 'save')
        .mockResolvedValue({
          group,
        } as unknown as Student);
      const patchUserSpy = jest.spyOn(usersService, 'patch');

      const actual = await studentsService.patch(1, {
        groupId: 2,
      });

      expect(findUserIdSpy).not.toBeCalled();
      expect(findGroupSpy).toBeCalledWith(2);
      expect(saveStudentSpy).toBeCalledWith({
        id: 1,
        group,
      });
      expect(patchUserSpy).not.toBeCalled();
      expect(actual).toEqual({
        id: 1,
        group,
      });
    });
  });
});
