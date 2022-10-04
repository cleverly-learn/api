import { GroupsModule } from 'groups/groups.module';
import { Module } from '@nestjs/common';
import { Student } from 'students/entities/student.entity';
import { StudentsController } from 'students/students.controller';
import { StudentsService } from 'students/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UsersModule, GroupsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
