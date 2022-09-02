import { IsUUID } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsUUID('4')
  refreshToken!: string;
}
