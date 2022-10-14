import { Course } from 'courses/entities/course.entity';
import { CoursesController } from 'courses/courses.controller';
import { CoursesRepository } from 'courses/repositories/courses.repository';
import { CoursesService } from 'courses/courses.service';
import { GoogleModule } from 'google/google.module';
import { GroupsModule } from 'groups/groups.module';
import { LecturersModule } from 'lecturers/lecturers.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { ValidateCourseIdPipe } from 'courses/pipes/validate-course-id.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    LecturersModule,
    GoogleModule,
    GroupsModule,
    UsersModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository, ValidateCourseIdPipe],
  exports: [CoursesService],
})
export class CoursesModule {}
