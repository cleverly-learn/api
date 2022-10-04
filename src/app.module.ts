import { AuthModule } from 'auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FacultiesModule } from 'faculties/faculties.module';
import { GroupsModule } from 'groups/groups.module';
import { LecturersModule } from 'lecturers/lecturers.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { StudentsModule } from 'students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        database: configService.get('DB_NAME'),
        password: configService.get('DB_PASSWORD'),
        ssl: configService.get('NODE_ENV') === 'production' && {
          rejectUnauthorized: false,
        },
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
        logging: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    ScheduleModule,
    LecturersModule,
    FacultiesModule,
    StudentsModule,
  ],
})
export class AppModule {}
