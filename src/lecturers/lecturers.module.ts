import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersController } from 'lecturers/lecturers.controller';
import { LecturersRepository } from 'lecturers/repositories/lecturers.repository';
import { LecturersService } from 'lecturers/lecturers.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer]), ScheduleModule, UsersModule],
  controllers: [LecturersController],
  providers: [LecturersService, LecturersRepository],
  exports: [LecturersService],
})
export class LecturersModule {}
