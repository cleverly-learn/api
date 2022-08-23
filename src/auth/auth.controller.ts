import { ApiBody } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';
import { LoginRequestDto } from 'auth/dto/login.request.dto';
import { SafeUser } from 'users/types/safe-user.type';
import { TokenPair } from 'auth/helpers/token-pair';
import { User } from 'auth/decorators/user.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginRequestDto })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@User() user: SafeUser): Promise<TokenPair> {
    return this.authService.generateTokenPair(user.id);
  }
}
