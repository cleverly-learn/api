import { FacultiesController } from 'faculties/faculties.controller';
import { FacultiesService } from 'faculties/faculties.service';
import { Faculty } from 'faculties/entities/faculty.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
