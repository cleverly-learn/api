import { AuthService } from 'auth/auth.service';
import { GroupsService } from 'groups/groups.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from 'students/entities/student.entity';
import { UsersService } from 'users/users.service';

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
    const user = await this.usersService.create({
      login: AuthService.generateLogin(),
      firstName,
      lastName,
      patronymic,
      email,
      isAdmin: false,
      isRegistered: false,
    });
    const group = await this.groupsService.findById(groupId);

    return this.studentsRepository.save({
      user,
      group,
    });
  }
}
