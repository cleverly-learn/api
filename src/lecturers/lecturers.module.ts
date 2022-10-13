import { CoursesModule } from 'courses/courses.module';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersController } from 'lecturers/lecturers.controller';
import { LecturersRepository } from 'lecturers/repositories/lecturers.repository';
import { LecturersService } from 'lecturers/lecturers.service';
import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { ValidateLecturerIdPipe } from 'lecturers/pipes/validate-lecturer-id.pipe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecturer]),
    forwardRef(() => UsersModule),
    forwardRef(() => CoursesModule),
    ScheduleModule,
  ],
  controllers: [LecturersController],
  providers: [LecturersService, LecturersRepository, ValidateLecturerIdPipe],
  exports: [LecturersService],
})
export class LecturersModule {}
