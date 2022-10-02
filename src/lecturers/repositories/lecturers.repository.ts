import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Lecturer } from 'lecturers/entities/lecturer.entity';

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
}
