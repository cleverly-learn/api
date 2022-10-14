import { CoursesService } from 'courses/courses.service';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateCourseIdPipe implements PipeTransform {
  constructor(private readonly coursesService: CoursesService) {}

  async transform(value: number): Promise<number> {
    const exists = await this.coursesService.existsById(value);

    if (!exists) {
      throw new NotFoundException(`Course with id ${value} is not found`);
    }

    return value;
  }
}
