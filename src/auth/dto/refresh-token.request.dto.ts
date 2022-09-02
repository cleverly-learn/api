import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
