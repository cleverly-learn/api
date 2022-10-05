import { GroupsModule } from 'groups/groups.module';
import { Module, forwardRef } from '@nestjs/common';
import { Student } from 'students/entities/student.entity';
import { StudentsController } from 'students/students.controller';
import { StudentsRepository } from 'students/repositories/students.repository';
import { StudentsService } from 'students/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    forwardRef(() => UsersModule),
    GroupsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
