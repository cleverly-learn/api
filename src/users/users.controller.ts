import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserRequestDto } from 'users/dto/create-user.request.dto';
import { GetAllRequestDto } from 'users/dto/get-all.request.dto';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { PatchUserRequestDto } from 'users/dto/patch-user.request.dto';
import { PatchUserResponseDto } from 'users/dto/patch-user.response.dto';
import { Symbols, randomString } from '_common/utils/random-string';
import { UserDto } from 'users/dto/user.dto';
import { UserId } from 'auth/decorators/user.decorators';
import { UsersService } from 'users/users.service';
import { ValidateUserIdPipe } from '_common/pipes/validate-user-id.pipe';
import { isAdmin } from '_common/enums/role.enum';
import { isEqual, isUndefined } from 'lodash';

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
    @Body() patchUserDto: PatchUserRequestDto,
  ): Promise<PatchUserResponseDto> {
    return this.patch(userId, patchUserDto);
  }

  @Get()
  async getAll(
    @Query() { role, ...page }: GetAllRequestDto,
  ): Promise<UserDto[]> {
    if (isUndefined(role) || !isAdmin(role)) {
      return [];
    }

    const users = await this.usersService.findAllAdmins(page);

    return users.map((user) => new UserDto(user));
  }

  @Patch(':id')
  async patch(
    @Param('id', ValidateUserIdPipe) id: number,
    @Body() patchUserDto: PatchUserRequestDto,
  ): Promise<PatchUserResponseDto> {
    const protectedDto = await AuthService.withHashedPassword(patchUserDto);
    const user = await this.usersService.patch(id, protectedDto);

    return new PatchUserResponseDto(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<UserDto> {
    const protectedDto = await AuthService.withHashedPassword(createUserDto);
    const user = await this.usersService.create({
      ...protectedDto,
      login: randomString(10, Symbols.LATIN_LETTERS),
      email: protectedDto.email ?? '',
      phone: '',
      telegram: '',
      details: '',
    });

    return new UserDto(user);
  }

  @Delete(':id')
  async delete(
    @UserId() userId: number,
    @Param('id') id: number,
  ): Promise<void> {
    if (isEqual(userId, id)) {
      throw new BadRequestException("Can't delete current user");
    }

    return this.usersService.delete(id);
  }
}
