import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { Student } from 'students/entities/student.entity';
import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

@Injectable()
export class StudentsRepository extends Repository<Student> {
  constructor(entityManager: EntityManager) {
    super(Student, entityManager);
  }

  findAllAndCount(pageable?: Pageable): Promise<[Student[], number]> {
    return this.findAndCount({
      order: { user: { lastName: 'ASC', firstName: 'ASC', patronymic: 'ASC' } },
      ...getPageableFindOptions(pageable),
    });
  }

  async findUserIdByStudentId(studentId: number): Promise<number> {
    const { user } = await this.findOneOrFail({
      where: { id: studentId },
      select: { user: { id: true } },
    });
    return user.id;
  }
}
