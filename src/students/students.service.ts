import { AuthService } from 'auth/auth.service';
import { GroupsService } from 'groups/groups.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { Student } from 'students/entities/student.entity';
import { UsersService } from 'users/users.service';
import { isEmail } from 'class-validator';

interface CreateParams {
  firstName: string;
  lastName: string;
  patronymic: string;
  email?: string;
  groupId: number;
}

@Injectable()
export class StudentsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    private readonly mailerService: MailerService,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
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
    const group = await this.groupsService.findById(groupId);

    if (isEmail(email)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.mailerService.sendMail({
        to: 'vladhookovskiy@gmail.com',
        subject: 'Логін та пароль для реєстрації',
        text: `Логін: ${user.login}\nПароль: ${user.password}`,
      });
    }

    return this.studentsRepository.save({
      user: savedUser,
      group,
    });
  }
}
