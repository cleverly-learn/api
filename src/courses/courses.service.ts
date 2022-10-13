import { Course } from 'courses/entities/course.entity';
import { GoogleService } from 'google/google.service';
import { GroupsService } from 'groups/groups.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { LecturersService } from 'lecturers/lecturers.service';
import { Repository } from 'typeorm';
import { UsersService } from 'users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly googleService: GoogleService,
    private readonly lecturersService: LecturersService,
    private readonly usersService: UsersService,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create({
    ownerUserId,
    name,
    groupsIds,
    withClassroom,
  }: {
    ownerUserId: number;
    name: string;
    groupsIds: number[];
    withClassroom: boolean;
  }): Promise<Course> {
    const [groups, lecturer, credentials] = await Promise.all([
      this.groupsService.findAllWithStudentsByIds(groupsIds),
      this.lecturersService.findOneByUserId(ownerUserId),
      this.usersService.findOneWithGoogleCredentials(ownerUserId),
    ]);

    if (withClassroom) {
      const course = await this.googleService.createCourse(
        {
          name,
          studentsIds: groups.flatMap(({ students }) =>
            students.map(({ user }) => user.email),
          ),
        },
        {
          refresh_token: credentials.googleRefreshToken,
        },
      );
      return this.coursesRepository.save({
        name: course.name ?? undefined,
        classroomId: course.id ?? undefined,
        classroomLink: course.alternateLink ?? undefined,
        owner: lecturer,
        groups,
      });
    }

    return this.coursesRepository.save({
      owner: lecturer,
      groups,
    });
  }
}
