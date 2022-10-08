import { Faculty } from 'faculties/entities/faculty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultiesRepository: Repository<Faculty>,
  ) {}

  findAll(): Promise<Faculty[]> {
    return this.facultiesRepository.find({ order: { name: 'ASC' } });
  }

  create(faculties: Omit<Faculty, 'id'>[]): Promise<Faculty[]> {
    return this.facultiesRepository.save(faculties);
  }
}
