import { GroupDto } from 'schedule/dto/group.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LecturerDto } from 'schedule/dto/lecturer.dto';
import { Page } from 'schedule/dto/page.dto';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  getGroups(): Promise<GroupDto[]> {
    return firstValueFrom(
      this.httpService
        .get<Page<GroupDto>>('/schedule/groups')
        .pipe(map((response) => response.data.data)),
    );
  }

  getLecturers(): Promise<LecturerDto[]> {
    return firstValueFrom(
      this.httpService
        .get<Page<LecturerDto>>('/schedule/lecturer/list')
        .pipe(map((response) => response.data.data)),
    );
  }
}
