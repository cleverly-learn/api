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
        .spyOn(groupsService, 'findById')
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
});
