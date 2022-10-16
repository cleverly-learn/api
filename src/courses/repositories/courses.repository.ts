import { Course } from 'courses/entities/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesRepository extends Repository<Course> {
  constructor(entityManager: EntityManager) {
    super(Course, entityManager);
  }

  findOneById(id: number): Promise<Course> {
    return this.findOneOrFail({
      where: { id },
      relations: {
        owner: true,
      },
    });
  }

  findOneWithGroupsById(id: number): Promise<Course> {
    return this.findOneOrFail({
      where: { id },
      order: {
        groups: {
          students: {
            user: { lastName: 'ASC', firstName: 'ASC', patronymic: 'ASC' },
          },
        },
      },
      relations: {
        owner: true,
        groups: {
          students: true,
        },
      },
    });
  }

  async findAll({
    ownerUserId,
    studentUserId,
  }: {
    ownerUserId?: number;
    studentUserId?: number;
  }): Promise<Course[]> {
    const queryBuilder = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.groups', 'group')
      .leftJoinAndSelect('group.faculty', 'faculty')
      .leftJoinAndSelect('course.owner', 'owner')
      .leftJoinAndSelect('owner.user', 'user')
      .orderBy('course.id');
    if (ownerUserId) {
      queryBuilder.where('user.id = :ownerUserId', { ownerUserId });
    }
    if (studentUserId) {
      const whereCoursesQueryBuilder = this.createQueryBuilder('course')
        .select('course.id')
        .innerJoin('course.groups', 'group')
        .innerJoin('group.students', 'student')
        .innerJoin('student.user', 'user')
        .where('user.id = :studentUserId', { studentUserId });

      queryBuilder
        .where(`course.id IN (${whereCoursesQueryBuilder.getQuery()})`)
        .setParameters(whereCoursesQueryBuilder.getParameters());
    }

    return queryBuilder.getMany();
  }
}
