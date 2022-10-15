import { Course } from 'courses/entities/course.entity';
import { CoursesRepository } from 'courses/repositories/courses.repository';
import { GoogleService } from 'google/google.service';
import { GroupsService } from 'groups/groups.service';
import { Injectable } from '@nestjs/common';
import { LecturersService } from 'lecturers/lecturers.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly googleService: GoogleService,
    private readonly lecturersService: LecturersService,
    private readonly usersService: UsersService,
    private readonly coursesRepository: CoursesRepository,
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
      this.groupsService.findAllByIds(groupsIds),
      this.lecturersService.findOneByUserId(ownerUserId),
      this.usersService.findOneWithGoogleCredentials(ownerUserId),
    ]);

    if (withClassroom) {
      const course = await this.googleService.createCourse(
        {
          name,
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
      name,
      groups,
    });
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.coursesRepository.countBy({ id });
    return count > 0;
  }

  findOneById(id: number): Promise<Course> {
    return this.coursesRepository.findOneById(id);
  }

  async inviteStudentsForCourse(course: Course): Promise<void> {
    const { googleRefreshToken } =
      await this.usersService.findOneWithGoogleCredentials(
        course.owner.user.id,
      );
    const registeredStudentsEmails = course.groups.flatMap(({ students }) =>
      students
        .map(({ user }) => user)
        .filter(({ isRegistered }) => isRegistered)
        .map(({ email }) => email),
    );

    return this.googleService.inviteStudentsToCourse(
      {
        courseId: course.classroomId,
        studentsIds: registeredStudentsEmails,
      },
      {
        refresh_token: googleRefreshToken,
      },
    );
  }

  findAllByOwnerUserId(ownerUserId: number): Promise<Course[]> {
    return this.coursesRepository.findAllByOwnerId(ownerUserId);
  }
}
