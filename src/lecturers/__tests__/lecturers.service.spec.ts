import { AuthService } from 'auth/auth.service';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersService } from 'lecturers/lecturers.service';
import { Repository } from 'typeorm';
import { ScheduleService } from 'schedule/schedule.service';
import { Test } from '@nestjs/testing';
import { UsersService } from 'users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProvider, mockRepository } from '_common/utils/test-helpers';

describe('LecturersService', () => {
  let lecturersService: LecturersService;
  let scheduleService: ScheduleService;
  let lecturersRepository: Repository<Lecturer>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LecturersService,
        mockProvider(ScheduleService),
        mockProvider(UsersService),
        mockRepository(Lecturer),
      ],
    }).compile();

    lecturersService = module.get(LecturersService);
    scheduleService = module.get(ScheduleService);
    lecturersRepository = module.get(getRepositoryToken(Lecturer));
    usersService = module.get(UsersService);
  });

  describe('synchronize', () => {
    it('When: No new lecturers. Expected: Users are not saving', async () => {
      scheduleService.getLecturers = jest.fn().mockResolvedValue([]);
      lecturersRepository.find = jest.fn().mockResolvedValue([]);
      const batchCreateSpy = jest.spyOn(usersService, 'batchCreate');

      await lecturersService.synchronize();

      expect(batchCreateSpy).not.toBeCalled();
    });

    it('When: New lecturers exist. Expected: Save users and lecturers', async () => {
      scheduleService.getLecturers = jest.fn().mockResolvedValue([
        { id: 'l1', name: 'q w e' },
        { id: 'l2', name: 'a s d' },
        { id: 'l3', name: 'z x c' },
      ]);
      lecturersRepository.find = jest
        .fn()
        .mockResolvedValue([{ id: 3, scheduleId: 'l3' }]);
      usersService.batchCreate = jest
        .fn()
        .mockResolvedValue([{ login: 'log1' }, { login: 'log2' }]);
      const expectedUsers = [
        {
          login: 'test1',
          lastName: 'q',
          firstName: 'w',
          patronymic: 'e',
          isRegistered: false,
          isAdmin: false,
        },
        {
          login: 'test2',
          lastName: 'a',
          firstName: 's',
          patronymic: 'd',
          isRegistered: false,
          isAdmin: false,
        },
      ];
      usersService.batchCreate = jest.fn().mockResolvedValue(expectedUsers);
      const batchCreateSpy = jest.spyOn(usersService, 'batchCreate');
      lecturersRepository.save = jest.fn().mockResolvedValue([
        { id: 1, scheduleId: 'l1' },
        { id: 2, scheduleId: 'l2' },
      ]);
      const saveSpy = jest.spyOn(lecturersRepository, 'save');
      AuthService.generateLogin = jest
        .fn()
        .mockReturnValueOnce('test1')
        .mockReturnValueOnce('test2');

      const actual = await lecturersService.synchronize();

      expect(actual).toEqual([
        { id: 3, scheduleId: 'l3' },
        { id: 1, scheduleId: 'l1' },
        { id: 2, scheduleId: 'l2' },
      ]);
      expect(batchCreateSpy).toBeCalledWith(expectedUsers);
      expect(saveSpy).toBeCalledWith([
        {
          scheduleId: 'l1',
          user: expectedUsers[0],
        },
        {
          scheduleId: 'l2',
          user: expectedUsers[1],
        },
      ]);
    });
  });
});
