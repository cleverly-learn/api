import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { Repository } from 'typeorm';
import { ScheduleService } from 'schedule/schedule.service';
import { UsersService } from 'users/users.service';
import { differenceWith, isEmpty } from 'lodash';
import { mapScheduleDtoToNewLecturer } from 'lecturers/mappers/lecturers.mapper';

@Injectable()
export class LecturersService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly usersService: UsersService,
    @InjectRepository(Lecturer)
    private readonly lecturersRepository: Repository<Lecturer>,
  ) {}

  async synchronize(): Promise<Lecturer[]> {
    const [existingLecturers, fetchedScheduleLecturers] = await Promise.all([
      this.lecturersRepository.find(),
      this.scheduleService.getLecturers(),
    ]);
    const notExistingLecturers = differenceWith(
      fetchedScheduleLecturers,
      existingLecturers,
      (dto, entity) => dto.id === entity.scheduleId,
    );

    if (isEmpty(notExistingLecturers)) {
      return existingLecturers;
    }

    const notExistingNewLecturers = notExistingLecturers.map(
      mapScheduleDtoToNewLecturer,
    );
    const savedUsers = await this.usersService.batchCreate(
      notExistingNewLecturers.map(({ user }) => user),
    );
    const lecturersWithSavedUsers = notExistingNewLecturers.map((lecturer) => ({
      ...lecturer,
      user: savedUsers.find(({ login }) => login === lecturer.user.login),
    }));

    const savedLecturers = await this.lecturersRepository.save(
      lecturersWithSavedUsers,
    );

    return existingLecturers.concat(savedLecturers);
  }
}
