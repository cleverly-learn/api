import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';
import { LoginRequestDto } from 'auth/dto/login.request.dto';
import { RefreshTokenPairRequestDto } from 'auth/dto/refresh-token-pair.request.dto';
import { RevokeRefreshTokenRequestDto } from 'auth/dto/revoke-refresh-token.request.dto';
import { TokenPairDto } from 'auth/dto/token-pair.dto';
import { UserId } from 'auth/decorators/user.decorators';
import { isNull } from 'lodash';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginRequestDto })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@UserId() userId: number): Promise<TokenPairDto> {
    return this.authService.generateTokenPair(userId);
  }

  @Post('refresh')
  async refreshTokenPair(
    @Body() { refreshToken }: RefreshTokenPairRequestDto,
  ): Promise<TokenPairDto> {
    const tokenPair = await this.authService.refreshTokenPair(refreshToken);

    if (isNull(tokenPair)) {
      throw new UnauthorizedException();
    }

    return tokenPair;
  }

  @Post('revoke')
  async revokeRefreshToken(
    @Body() { refreshToken }: RevokeRefreshTokenRequestDto,
  ): Promise<void> {
    return this.authService.removeRefreshToken(refreshToken);
  }
}
