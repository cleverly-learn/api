import { GoogleService } from 'google/google.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
