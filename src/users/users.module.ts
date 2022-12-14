import { AuthModule } from 'auth/auth.module';
import { GoogleModule } from 'google/google.module';
import { LecturersModule } from 'lecturers/lecturers.module';
import { Module, forwardRef } from '@nestjs/common';
import { StudentsModule } from 'students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'users/entities/user.entity';
import { UsersController } from 'users/users.controller';
import { UsersRepository } from 'users/repositories/users.repository';
import { UsersService } from 'users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LecturersModule),
    forwardRef(() => StudentsModule),
    forwardRef(() => AuthModule),
    GoogleModule,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
