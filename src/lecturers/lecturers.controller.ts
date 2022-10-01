import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseGuards } from '@nestjs/common';
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
}
