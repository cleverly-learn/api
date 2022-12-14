import { CoursesRepository } from 'courses/repositories/courses.repository';
import { CoursesService } from 'courses/courses.service';
import { Faculty } from 'faculties/entities/faculty.entity';
import { GoogleService } from 'google/google.service';
import { Group } from 'groups/entities/group.entity';
import { GroupsService } from 'groups/groups.service';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersService } from 'lecturers/lecturers.service';
import { Test } from '@nestjs/testing';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import {
  mockProvider,
  mockRepositoryProvider,
} from '_common/utils/test-helpers';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let lecturersService: LecturersService;
  let usersService: UsersService;
  let groupsService: GroupsService;
  let googleService: GoogleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        mockProvider(LecturersService),
        mockProvider(UsersService),
        mockProvider(GroupsService),
        mockProvider(GoogleService),
        mockRepositoryProvider(CoursesRepository),
      ],
    }).compile();

    coursesService = module.get(CoursesService);
    lecturersService = module.get(LecturersService);
    usersService = module.get(UsersService);
    groupsService = module.get(GroupsService);
    googleService = module.get(GoogleService);
  });

  describe('createCourse', () => {
    it('When: With classroom. Expected: All arguments passed correctly', async () => {
      const usersSpy = jest
        .spyOn(usersService, 'findOneWithGoogleCredentials')
        .mockResolvedValue({
          googleRefreshToken: 'refresh',
        });
      const lecturer: Lecturer = {
        id: 123,
        scheduleId: 'schedule id',
        user: {} as User,
      };
      const lecturersSpy = jest
        .spyOn(lecturersService, 'findOneByUserId')
        .mockResolvedValue(lecturer);
      const groups: Group[] = [
        {
          faculty: {} as Faculty,
          id: 34436,
          name: 'test group 1',
          scheduleId: 'group schedule',
          students: [],
        },
        {
          faculty: {} as Faculty,
          id: 436,
          name: 'test group 2',
          scheduleId: 'group schedule 2',
          students: [],
        },
        {
          faculty: {} as Faculty,
          id: 4361,
          name: 'test group 3',
          scheduleId: 'group schedule 3',
          students: [],
        },
      ];
      const groupsSpy = jest
        .spyOn(groupsService, 'findAllByIds')
        .mockResolvedValue(groups);
      const googleCourse = {
        name: 'new group',
        id: 'qwerty',
        alternativeLink: 'http',
      };
      const googleSpy = jest
        .spyOn(googleService, 'createCourse')
        .mockResolvedValue(googleCourse);

      await coursesService.create({
        groupsIds: [1, 2, 3],
        name: 'test course',
        ownerUserId: 7,
        withClassroom: true,
      });

      expect(usersSpy).toBeCalledWith(7);
      expect(lecturersSpy).toBeCalledWith(7);
      expect(groupsSpy).toBeCalledWith([1, 2, 3]);
      expect(googleSpy).toBeCalledWith(
        {
          name: 'test course',
        },
        {
          refresh_token: 'refresh',
        },
      );
    });
  });

  describe('inviteStudentsForCourse', () => {
    it('When: Exists non registered users. Expected: Registered users invited', async () => {
      const usersSpy = jest
        .spyOn(usersService, 'findOneWithGoogleCredentials')
        .mockResolvedValue({
          googleRefreshToken: 'refresh',
        });
      const lecturer: Lecturer = {
        id: 123,
        scheduleId: 'schedule id',
        user: {
          id: 7,
        } as User,
      };
      const groups: Group[] = [
        {
          faculty: {} as Faculty,
          id: 34436,
          name: 'test group 1',
          scheduleId: 'group schedule',
          students: [
            {
              group: {} as Group,
              id: 387,
              user: { email: 'email1', isRegistered: true } as User,
            },
          ],
        },
        {
          faculty: {} as Faculty,
          id: 436,
          name: 'test group 2',
          scheduleId: 'group schedule 2',
          students: [
            {
              group: {} as Group,
              id: 736,
              user: { email: 'email2', isRegistered: true } as User,
            },
          ],
        },
        {
          faculty: {} as Faculty,
          id: 4361,
          name: 'test group 3',
          scheduleId: 'group schedule 3',
          students: [
            {
              group: {} as Group,
              id: 7336,
              user: { email: 'email3', isRegistered: false } as User,
            },
          ],
        },
      ];
      const googleSpy = jest.spyOn(googleService, 'inviteStudentsToCourse');

      await coursesService.inviteStudentsForCourse({
        id: 523,
        name: 'test',
        classroomId: 'class',
        classroomLink: 'http',
        groups,
        owner: lecturer,
      });

      expect(usersSpy).toBeCalledWith(7);
      expect(googleSpy).toBeCalledWith(
        {
          courseId: 'class',
          studentsIds: ['email1', 'email2'],
        },
        {
          refresh_token: 'refresh',
        },
      );
    });
  });
});
