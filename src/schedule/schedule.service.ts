import { GroupDto } from 'schedule/dto/group.dto';
import { GroupResponseDto } from 'schedule/dto/group-response.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class ScheduleService {
  constructor(private readonly httpService: HttpService) {}

  getGroups(): Promise<GroupDto[]> {
    return firstValueFrom(
      this.httpService
        .get<GroupResponseDto>('/schedule/groups')
        .pipe(map((response) => response.data.data)),
    );
  }
}
