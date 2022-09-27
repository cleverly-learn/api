import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleService } from 'schedule/schedule.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://schedule.kpi.ua/api',
    }),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
