import * as randomStringUtil from '_common/utils/random-string';
import { AuthService } from 'auth/auth.service';
import { LecturersRepository } from 'lecturers/repositories/lecturers.repository';
import { LecturersService } from 'lecturers/lecturers.service';
import { ScheduleService } from 'schedule/schedule.service';
import { Test } from '@nestjs/testing';
import { UsersService } from 'users/users.service';
import {
  mockProvider,
  mockRepositoryProvider,
} from '_common/utils/test-helpers';

describe('LecturersService', () => {
  let lecturersService: LecturersService;
  let scheduleService: ScheduleService;
  let lecturersRepository: LecturersRepository;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LecturersService,
        mockProvider(ScheduleService),
        mockProvider(UsersService),
        mockRepositoryProvider(LecturersRepository),
      ],
    }).compile();

    lecturersService = module.get(LecturersService);
    scheduleService = module.get(ScheduleService);
    lecturersRepository = module.get(LecturersRepository);
    usersService = module.get(UsersService);
  });

  describe('synchronize', () => {
    it('When: No new lecturers. Expected: Users are not saving', async () => {
      scheduleService.getLecturers = jest.fn().mockResolvedValue([]);
      lecturersRepository.find = jest.fn().mockResolvedValue([]);
      const batchCreateSpy = jest.spyOn(usersService, 'bulkPut');

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
      usersService.bulkPut = jest
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
      usersService.bulkPut = jest.fn().mockResolvedValue(expectedUsers);
      const batchCreateSpy = jest.spyOn(usersService, 'bulkPut');
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

  describe('exportNonRegisteredToExcel', () => {
    it('When: No not registered users. Expected: Users not hashed and not saved', async () => {
      lecturersRepository.findAllNotRegistered = jest
        .fn()
        .mockResolvedValue([]);
      const hashSpy = jest.spyOn(AuthService, 'withHashedPassword');
      const saveSpy = jest.spyOn(usersService, 'bulkPut');

      await lecturersService.exportNonRegisteredToExcel();

      expect(hashSpy).not.toBeCalled();
      expect(saveSpy).not.toBeCalled();
    });

    it('When: Exists not registered users. Expected: Users saved with new hash', async () => {
      lecturersRepository.findAllNotRegistered = jest
        .fn()
        .mockResolvedValue([{ user: {} }]);
      jest.spyOn(randomStringUtil, 'randomString').mockReturnValue('test');
      const hashSpy = jest
        .spyOn(AuthService, 'withHashedPassword')
        .mockResolvedValue({ password: 'hash' });
      const saveSpy = jest.spyOn(usersService, 'bulkPut');
      const exportSpy = jest.spyOn(usersService, 'createExcelFromUsers');

      await lecturersService.exportNonRegisteredToExcel();

      expect(exportSpy).toBeCalledWith([{ password: 'test' }]);

      await new Promise((resolve) => {
        setTimeout(() => {
          expect(hashSpy).toBeCalledWith({ password: 'test' });
          expect(saveSpy).toBeCalledWith([{ password: 'hash' }]);
          resolve(null);
        });
      });
    });
  });
});
