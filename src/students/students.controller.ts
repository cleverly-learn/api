import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBodyDto } from 'students/dto/create.body.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Page } from '_common/dto/page.dto';
import { PageableDto } from '_common/dto/pageable.dto';
import { PatchBodyDto } from 'students/dto/patch.body.dto';
import { PatchResponseDto } from 'students/dto/patch.response.dto';
import { StudentDto } from 'students/dto/student.dto';
import { StudentsService } from 'students/students.service';
import { ValidateUserIdPipe } from '_common/pipes/validate-user-id.pipe';

@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiTags('Students')
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getAll(@Query() pageable: PageableDto): Promise<Page<StudentDto>> {
    const [students, totalElements] =
      await this.studentsService.findAllAndCount(pageable);
    const data = students.map((student) => new StudentDto(student));
    return new Page({ data, totalElements });
  }

  @Post()
  async create(@Body() body: CreateBodyDto): Promise<StudentDto> {
    const student = await this.studentsService.create(body);
    return new StudentDto(student);
  }

  @Patch(':id')
  async patch(
    @Param('id', ValidateUserIdPipe) id: number,
    @Body() body: PatchBodyDto,
  ): Promise<PatchResponseDto> {
    const student = await this.studentsService.patch(id, body);
    return new PatchResponseDto(student);
  }
}
