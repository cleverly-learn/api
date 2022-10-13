import { AreGroupExistConstraint } from 'groups/validators/are-groups-exist/are-groups-exist.constraint';
import { FacultiesModule } from 'faculties/faculties.module';
import { Group } from 'groups/entities/group.entity';
import { GroupsController } from 'groups/groups.controller';
import { GroupsRepository } from 'groups/repositories/groups.repository';
import { GroupsService } from 'groups/groups.service';
import { IsGroupExistConstraint } from 'groups/validators/is-group-exist/is-group-exist.constraint';
import { Module } from '@nestjs/common';
import { ScheduleModule } from 'schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateGroupIdPipe } from 'groups/pipes/validate-group-id.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), ScheduleModule, FacultiesModule],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    GroupsRepository,
    IsGroupExistConstraint,
    AreGroupExistConstraint,
    ValidateGroupIdPipe,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
