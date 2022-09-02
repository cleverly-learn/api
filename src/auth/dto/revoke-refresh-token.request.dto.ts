import { IsUUID } from 'class-validator';

export class RevokeRefreshTokenRequestDto {
  @IsUUID('4')
  refreshToken!: string;
}
