import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Header,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { LecturersService } from 'lecturers/lecturers.service';

@Controller('lecturers')
@UseGuards(JwtAuthGuard)
@ApiTags('Lecturers')
@ApiBearerAuth()
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

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
}
