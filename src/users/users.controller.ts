import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { PatchCurrentUserRequestDto } from 'users/dto/patch-current-user.request.dto';
import { UserDto } from 'users/dto/user.dto';
import { UserId } from 'auth/decorators/user.decorators';
import { UsersService } from 'users/users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@UserId() userId: number): Promise<UserDto> {
    const user = await this.usersService.findOneById(userId);
    return new UserDto(user);
  }

  @Patch('me')
  async patchCurrentUser(
    @UserId() userId: number,
    @Body() patchUserDto: PatchCurrentUserRequestDto,
  ): Promise<UserDto> {
    const protectedDto = await AuthService.withHashedPassword(patchUserDto);
    const user = await this.usersService.patch(userId, protectedDto);
    return new UserDto(user);
  }
}
