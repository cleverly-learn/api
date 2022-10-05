import { FacultiesService } from 'faculties/faculties.service';
import { Faculty } from 'faculties/entities/faculty.entity';
import { Group } from 'groups/entities/group.entity';
import { GroupDto } from 'schedule/dto/group.dto';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { ScheduleService } from 'schedule/schedule.service';
import { differenceBy, isEmpty, uniq } from 'lodash';
import { mapScheduleDtoToEntity } from 'groups/mappers/groups.mapper';

@Injectable()
export class GroupsService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly facultiesService: FacultiesService,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async synchronize(): Promise<Group[]> {
    const [existingFaculties, existingGroups, fetchedGroups] =
      await Promise.all([
        this.facultiesService.findAll(),
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

    if (isEmpty(notExistantFaculties)) {
      return existingFaculties;
    }

    const savedFaculties = await this.facultiesService.create(
      notExistantFaculties,
    );

    return existingFaculties.concat(savedFaculties);
  }

  private async syncGroupsAndFindAll(
    fetchedScheduleGroups: GroupDto[],
    existingGroups: Group[],
    faculties: Faculty[],
  ): Promise<Group[]> {
    const fetchedGroups = fetchedScheduleGroups.map(mapScheduleDtoToEntity);
    const notExistingGroups = differenceBy(
      fetchedGroups,
      existingGroups,
      'scheduleId',
    );
    const notExistantGroupsWithFaculties = notExistingGroups.map((group) => ({
      ...group,
      faculty: faculties.find(({ name }) => name === group.faculty.name),
    }));

    if (isEmpty(notExistingGroups)) {
      return existingGroups;
    }

    const savedGroups = await this.groupsRepository.save(
      notExistantGroupsWithFaculties,
    );

    return existingGroups.concat(savedGroups);
  }

  findAllAndCount(
    options?: { facultyId?: number } & Pageable,
  ): Promise<[Group[], number]> {
    return this.groupsRepository.findAllAndCount(options);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.groupsRepository.countBy({ id });
    return count > 0;
  }

  findOneById(id: number): Promise<Group> {
    return this.groupsRepository.findOneByOrFail({ id });
  }
}
