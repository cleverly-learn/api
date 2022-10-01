import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersController } from 'lecturers/lecturers.controller';
import { LecturersService } from 'lecturers/lecturers.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer]), ScheduleModule, UsersModule],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [LecturersService],
})
export class LecturersModule {}
