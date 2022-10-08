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
      loadEagerRelations: false,
      relations: {
        faculty: true,
        students: true,
      },
      ...getPageableFindOptions({ page: options?.page, size: options?.size }),
    });
  }

  findOneWithStudentsById(id: number): Promise<Group> {
    return this.findOneOrFail({
      where: { id },
      order: {
        students: {
          user: { lastName: 'ASC', firstName: 'ASC', patronymic: 'ASC' },
        },
      },
      relations: { students: true },
    });
  }
}
