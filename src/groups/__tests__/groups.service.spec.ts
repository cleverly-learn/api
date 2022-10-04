import { FacultiesService } from 'faculties/faculties.service';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { GroupsService } from 'groups/groups.service';
import { ScheduleService } from 'schedule/schedule.service';
import { Test } from '@nestjs/testing';
import {
  mockProvider,
  mockRepositoryProvider,
} from '_common/utils/test-helpers';

describe('GroupsService', () => {
  let groupsService: GroupsService;
  let scheduleService: ScheduleService;
  let groupsRepository: GroupsRepository;
  let facultiesService: FacultiesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupsService,
        mockProvider(ScheduleService),
        mockProvider(FacultiesService),
        mockRepositoryProvider(GroupsRepository),
      ],
    }).compile();

    groupsService = module.get(GroupsService);
    scheduleService = module.get(ScheduleService);
    facultiesService = module.get(FacultiesService);
    groupsRepository = module.get(GroupsRepository);
  });

  describe('synchronize', () => {
    it('When: No new faculties. Expected: Faculties are not saving', async () => {
      scheduleService.getGroups = jest.fn().mockResolvedValue([]);
      facultiesService.findAll = jest.fn().mockResolvedValue([]);
      groupsRepository.find = jest.fn().mockResolvedValue([]);
      const saveSpy = jest.spyOn(facultiesService, 'create');

      await groupsService.synchronize();

      expect(saveSpy).not.toBeCalled();
    });

    it('When: New faculties exist. Expected: Save faculties', async () => {
      scheduleService.getGroups = jest
        .fn()
        .mockResolvedValue([
          { faculty: 'f1' },
          { faculty: 'f2' },
          { faculty: 'f3' },
        ]);
      facultiesService.findAll = jest.fn().mockResolvedValue([{ name: 'f3' }]);
      groupsRepository.find = jest.fn().mockResolvedValue([]);
      facultiesService.create = jest.fn().mockResolvedValue([]);
      const saveSpy = jest.spyOn(facultiesService, 'create');

      await groupsService.synchronize();

      expect(saveSpy).toBeCalledWith([{ name: 'f1' }, { name: 'f2' }]);
    });

    it('When: No new groups. Expected: Groups are not saving', async () => {
      scheduleService.getGroups = jest.fn().mockResolvedValue([]);
      facultiesService.findAll = jest.fn().mockResolvedValue([]);
      groupsRepository.find = jest.fn().mockResolvedValue([]);
      const saveSpy = jest.spyOn(groupsRepository, 'save');

      await groupsService.synchronize();

      expect(saveSpy).not.toBeCalled();
    });

    it('When: New groups exist with new and old faculties. Expected: Save groups with faculties', async () => {
      scheduleService.getGroups = jest.fn().mockResolvedValue([
        { faculty: 'f1', id: '1', name: 'g1' },
        { faculty: 'f2', id: '2', name: 'g2' },
      ]);
      facultiesService.findAll = jest
        .fn()
        .mockResolvedValue([{ id: 1, name: 'f1' }]);
      const existantGroups = [{ email: '', scheduleId: '3', name: 'g3' }];
      groupsRepository.find = jest.fn().mockResolvedValue(existantGroups);
      facultiesService.create = jest
        .fn()
        .mockResolvedValue([{ id: 2, name: 'f2' }]);
      const facultiesSaveSpy = jest.spyOn(facultiesService, 'create');
      const groupsToSave = [
        {
          faculty: {
            id: 1,
            name: 'f1',
          },
          name: 'g1',
          scheduleId: '1',
        },
        {
          faculty: {
            id: 2,
            name: 'f2',
          },
          name: 'g2',
          scheduleId: '2',
        },
      ];
      groupsRepository.save = jest.fn().mockResolvedValue(groupsToSave);
      const groupsSaveSpy = jest.spyOn(groupsRepository, 'save');

      const actual = await groupsService.synchronize();

      expect(facultiesSaveSpy).toBeCalledWith([{ name: 'f2' }]);
      expect(groupsSaveSpy).toBeCalledWith(groupsToSave);
      expect(actual).toEqual([...existantGroups, ...groupsToSave]);
    });
  });
});
