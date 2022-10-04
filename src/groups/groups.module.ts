import { FacultiesModule } from 'faculties/faculties.module';
import { Group } from 'groups/entities/group.entity';
import { GroupsController } from 'groups/groups.controller';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { GroupsService } from 'groups/groups.service';
import { IsGroupExistConstraint } from 'groups/validators/is-group-exist/is-group-exist.constraint';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), ScheduleModule, FacultiesModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository, IsGroupExistConstraint],
  exports: [GroupsService],
})
export class GroupsModule {}
