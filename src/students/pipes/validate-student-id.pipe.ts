import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { StudentsService } from 'students/students.service';

@Injectable()
export class ValidateStudentIdPipe implements PipeTransform {
  constructor(private readonly studentsService: StudentsService) {}

  async transform(value: number): Promise<number> {
    const exists = await this.studentsService.existsById(value);

    if (!exists) {
      throw new NotFoundException(`Student with id ${value} is not found`);
    }

    return value;
  }
}
