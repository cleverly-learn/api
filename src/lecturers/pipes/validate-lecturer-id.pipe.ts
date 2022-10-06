import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { LecturersService } from 'lecturers/lecturers.service';

@Injectable()
export class ValidateLecturerIdPipe implements PipeTransform {
  constructor(private readonly lecturersService: LecturersService) {}

  async transform(value: number): Promise<number> {
    const exists = await this.lecturersService.existsById(value);

    if (!exists) {
      throw new NotFoundException(`Lecturer with id ${value} is not found`);
    }

    return value;
  }
}
