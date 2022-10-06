import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { LecturersService } from 'lecturers/lecturers.service';
import { ValidateLecturerIdPipe } from 'lecturers/pipes/validate-lecturer-id.pipe';

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

  @Delete(':id')
  delete(@Param('id', ValidateLecturerIdPipe) id: number): Promise<void> {
    return this.lecturersService.delete(id);
  }
}
