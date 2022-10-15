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
        groups: {
          students: true,
        },
      },
    });
  }

  findAllByOwnerId(ownerUserId: number): Promise<Course[]> {
    return this.find({
      where: { owner: { user: { id: ownerUserId } } },
      relations: { groups: true },
    });
  }
}
