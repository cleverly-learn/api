import { AuthService } from 'auth/auth.service';
import { Injectable } from '@nestjs/common';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersRepository } from 'lecturers/repositories/lecturers.repository';
import { Pageable } from '_common/types/pageable.interface';
import { ScheduleService } from 'schedule/schedule.service';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { differenceWith, isEmpty } from 'lodash';
import { mapScheduleDtoToNewLecturer } from 'lecturers/mappers/lecturers.mapper';

@Injectable()
export class LecturersService {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly usersService: UsersService,
    private readonly lecturersRepository: LecturersRepository,
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
    const savedUsers = await this.usersService.bulkPut(
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

  async exportNonRegisteredToExcel() {
    const lecturers = await this.lecturersRepository.findAllNotRegistered();
    const usersWithPasswords = lecturers.map(({ user }) => ({
      ...user,
      password: AuthService.generatePassword(),
    }));

    if (usersWithPasswords.length) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hashAndUpdateUsers(usersWithPasswords);
    }

    return this.usersService.createExcelFromUsers(usersWithPasswords);
  }

  private async hashAndUpdateUsers(users: User[]): Promise<User[]> {
    const hashedUsers = await Promise.all(
      users.map((user) => AuthService.withHashedPassword(user)),
    );
    return this.usersService.bulkPut(hashedUsers);
  }

  findAllAndCount(pageable?: Pageable): Promise<[Lecturer[], number]> {
    return this.lecturersRepository.findAllAndCount(pageable);
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.lecturersRepository.countBy({ id });
    return count > 0;
  }

  async existsByUserId(userId: number): Promise<boolean> {
    const count = await this.lecturersRepository.countBy({
      user: { id: userId },
    });
    return count > 0;
  }

  findOneByUserId(id: number): Promise<Lecturer> {
    return this.lecturersRepository.findOneByOrFail({ user: { id } });
  }

  async delete(id: number): Promise<void> {
    const userId = await this.lecturersRepository.findUserIdByLecturerId(id);
    await this.usersService.delete(userId);
  }
}
