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

  findAllAndCount(pageable?: Pageable): Promise<[Group[], number]> {
    return this.findAndCount({
      order: { name: 'ASC' },
      ...getPageableFindOptions(pageable),
    });
  }
}
