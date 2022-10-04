import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FacultiesService } from 'faculties/faculties.service';
import { FacultyDto } from 'faculties/dto/faculty.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';

@Controller('faculties')
@UseGuards(JwtAuthGuard)
@ApiTags('Faculties')
@ApiBearerAuth()
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Get()
  async getAll(): Promise<FacultyDto[]> {
    const faculties = await this.facultiesService.findAll();
    return faculties.map((faculty) => new FacultyDto(faculty));
  }
}
