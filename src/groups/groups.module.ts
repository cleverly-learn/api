import { Faculty } from 'groups/entities/faculty.entity';
import { Group } from 'groups/entities/group.entity';
import { GroupsController } from 'groups/groups.controller';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { GroupsService } from 'groups/groups.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, Group]), ScheduleModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository],
})
export class GroupsModule {}
