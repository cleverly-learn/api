import { AuthService } from 'auth/auth.service';
import { Group } from 'groups/entities/group.entity';
import { GroupsService } from 'groups/groups.service';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Pageable } from '_common/types/pageable.interface';
import { Student } from 'students/entities/student.entity';
import { StudentsRepository } from 'students/repositories/students.repository';
import { UsersService } from 'users/users.service';
import { isEmail, isNotEmptyObject } from 'class-validator';
import { isUndefined } from 'lodash';

interface CreateParams {
  firstName: string;
  lastName: string;
  patronymic: string;
  email?: string;
  groupId: number;
}
interface PatchParams {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  groupId?: number;
}
interface PatchReturnValue {
  id: number;
  user?: {
    firstName?: string;
    lastName?: string;
    patronymic?: string;
  };
  group?: Group;
}

@Injectable()
export class StudentsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    private readonly mailerService: MailerService,
    private readonly studentsRepository: StudentsRepository,
  ) {}

  async create({
    firstName,
    lastName,
    patronymic,
    email,
    groupId,
  }: CreateParams): Promise<Student> {
    const user = {
      login: AuthService.generateLogin(),
      firstName,
      lastName,
      patronymic,
      email,
      password: AuthService.generatePassword(),
      isAdmin: false,
      isRegistered: false,
    };
    const hashedUser = await AuthService.withHashedPassword(user);
    const savedUser = await this.usersService.create(hashedUser);

    if (isEmail(email)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.mailerService.sendMail({
        to: email,
        subject: 'Логін та пароль для реєстрації',
        text: `Логін: ${user.login}\nПароль: ${user.password}`,
      });
    }

    const group = await this.groupsService.findOneById(groupId);

    return this.studentsRepository.save({
      user: savedUser,
      group,
    });
  }

  findAllAndCount(pageable?: Pageable): Promise<[Student[], number]> {
    return this.studentsRepository.findAllAndCount(pageable);
  }

  findOneByUserId(id: number): Promise<Student> {
    return this.studentsRepository.findOneByOrFail({ user: { id } });
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.studentsRepository.countBy({ id });
    return count > 0;
  }

  async patch(
    id: number,
    { groupId, ...params }: PatchParams,
  ): Promise<PatchReturnValue> {
    const user = await this.patchUser(id, params);
    const group = await this.patchStudentGroup(id, groupId);

    return {
      id,
      user,
      group,
    };
  }

  private async patchUser(
    studentId: number,
    params: Omit<PatchParams, 'groupId'>,
  ): Promise<Omit<PatchParams, 'groupId'> | undefined> {
    if (!isNotEmptyObject(params)) {
      return undefined;
    }

    const userId = await this.studentsRepository.findUserIdByStudentId(
      studentId,
    );
    return this.usersService.patch(userId, params);
  }

  private async patchStudentGroup(
    studentId: number,
    groupId?: number,
  ): Promise<Group | undefined> {
    if (isUndefined(groupId)) {
      return undefined;
    }

    const group = await this.groupsService.findOneById(groupId);
    const student = await this.studentsRepository.save({
      id: studentId,
      group,
    });

    return student.group;
  }

  async delete(id: number): Promise<void> {
    const userId = await this.studentsRepository.findUserIdByStudentId(id);
    await this.usersService.delete(userId);
  }
}
