import { Controller } from '@nestjs/common';
import { CoursesService } from 'courses/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
}
