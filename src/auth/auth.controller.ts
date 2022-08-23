import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SafeUser } from 'users/types/safe-user.type';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorators';
import { LoginRequestDto } from './dto/login.request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenPair } from './helpers/token-pair';

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
