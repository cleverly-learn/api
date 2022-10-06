import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { Pageable } from '_common/types/pageable.interface';
import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

@Injectable()
export class LecturersRepository extends Repository<Lecturer> {
  constructor(entityManager: EntityManager) {
    super(Lecturer, entityManager);
  }

  findAllNotRegistered(): Promise<Lecturer[]> {
    return this.find({
      where: { user: { isRegistered: false } },
    });
  }

  findAllAndCount(pageable?: Pageable): Promise<[Lecturer[], number]> {
    return this.findAndCount({
      order: { user: { lastName: 'ASC', firstName: 'ASC', patronymic: 'ASC' } },
      ...getPageableFindOptions(pageable),
    });
  }

  async findUserIdByLecturerId(lecturerId: number): Promise<number> {
    const { user } = await this.findOneOrFail({
      where: { id: lecturerId },
      select: { user: { id: true } },
    });
    return user.id;
  }
}
