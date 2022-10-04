import { Faculty } from 'faculties/entities/faculty.entity';

export class FacultyDto {
  id!: number;

  name!: string;

  constructor(faculty: Faculty) {
    this.id = faculty.id;
    this.name = faculty.name;
  }
}
