import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { LecturerDto } from 'lecturers/dto/lecturer.dto';
import { LecturersService } from 'lecturers/lecturers.service';
import { Page } from '_common/dto/page.dto';
import { PageableDto } from '_common/dto/pageable.dto';
import { ValidateLecturerIdPipe } from 'lecturers/pipes/validate-lecturer-id.pipe';

@Controller('lecturers')
@UseGuards(JwtAuthGuard)
@ApiTags('Lecturers')
@ApiBearerAuth()
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Get()
  async getAll(@Query() pageable: PageableDto): Promise<Page<LecturerDto>> {
    const [lecturers, totalElements] =
      await this.lecturersService.findAllAndCount(pageable);
    const data = lecturers.map((lecturer) => new LecturerDto(lecturer));
    return new Page({ data, totalElements });
  }

  @Post('sync')
  async synchronize(): Promise<void> {
    await this.lecturersService.synchronize();
  }

  @Get('/export')
  @ApiProperty({ description: 'Export not registered users to excel' })
  @Header('Content-Disposition', 'attachment; filename="Passwords.xlsx"')
  async export(): Promise<StreamableFile> {
    const stream = await this.lecturersService.exportNonRegisteredToExcel();

    return new StreamableFile(stream);
  }

  @Delete(':id')
  delete(@Param('id', ValidateLecturerIdPipe) id: number): Promise<void> {
    return this.lecturersService.delete(id);
  }
}
