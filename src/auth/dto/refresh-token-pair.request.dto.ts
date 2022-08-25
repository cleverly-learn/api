import { IsUUID } from 'class-validator';

export class RefreshTokenPairRequestDto {
  @IsUUID('4')
  refreshToken!: string;
}
