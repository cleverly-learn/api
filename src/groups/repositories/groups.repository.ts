import { EntityManager, Repository } from 'typeorm';
import { Group } from 'groups/entities/group.entity';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

@Injectable()
export class GroupsRepository extends Repository<Group> {
  constructor(entityManager: EntityManager) {
    super(Group, entityManager);
  }

  findAllAndCount(
    options?: { facultyId?: number } & Pageable,
  ): Promise<[Group[], number]> {
    return this.findAndCount({
      where: { faculty: { id: options?.facultyId } },
      order: { name: 'ASC' },
      ...getPageableFindOptions({ page: options?.page, size: options?.size }),
    });
  }
}
