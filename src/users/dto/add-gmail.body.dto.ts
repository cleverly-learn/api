import { IsNotEmpty, IsString } from 'class-validator';

export class AddGmailBodyDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
