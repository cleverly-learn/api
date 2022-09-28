import { Faculty } from 'groups/entities/faculty.entity';
import { Group } from 'groups/entities/group.entity';
import { GroupDto } from 'schedule/dto/group.dto';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { Repository } from 'typeorm';
import { ScheduleService } from 'schedule/schedule.service';
import { differenceBy, uniq } from 'lodash';
import { mapScheduleGroupToGroup } from 'groups/mappers/schedule-group-to-group.mapper';

@Injectable()
export class GroupsService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupsRepository: GroupsRepository,
    @InjectRepository(Faculty)
    private readonly facultiesRepository: Repository<Faculty>,
  ) {}

  async synchronize(): Promise<Group[]> {
    const [existingFaculties, existingGroups, fetchedGroups] =
      await Promise.all([
        this.facultiesRepository.find(),
        this.groupsRepository.find(),
        this.scheduleService.getGroups(),
      ]);

    const faculties = await this.syncFacultiessAndFindAll(
      fetchedGroups,
      existingFaculties,
    );
    return this.syncGroupsAndFindAll(fetchedGroups, existingGroups, faculties);
  }

  private async syncFacultiessAndFindAll(
    fetchedGroups: GroupDto[],
    existingFaculties: Faculty[],
  ): Promise<Faculty[]> {
    const newUniqueFaculties = uniq(
      fetchedGroups.map(({ faculty }) => faculty),
    ).map((name) => ({ name }));
    const notExistantFaculties = differenceBy(
      newUniqueFaculties,
      existingFaculties,
      'name',
    );
    const savedFaculties = await this.facultiesRepository.save(
      notExistantFaculties,
    );

    return existingFaculties.concat(savedFaculties);
  }

  private async syncGroupsAndFindAll(
    fetchedGroups: GroupDto[],
    existingGroups: Group[],
    faculties: Faculty[],
  ): Promise<Group[]> {
    const newGroups = fetchedGroups.map(mapScheduleGroupToGroup);
    const notExistantGroups = differenceBy(
      newGroups,
      existingGroups,
      'scheduleId',
    );
    const notExistantGroupsWithFaculties = notExistantGroups.map((group) => ({
      ...group,
      faculty: faculties.find(({ name }) => name === group.faculty.name),
    }));
    const savedGroups = await this.groupsRepository.save(
      notExistantGroupsWithFaculties,
    );

    return existingGroups.concat(savedGroups);
  }

  findAllAndCount(options?: Pageable): Promise<[Group[], number]> {
    return this.groupsRepository.findAllAndCount(options);
  }
}