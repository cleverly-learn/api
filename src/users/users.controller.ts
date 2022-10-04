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
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersService } from 'lecturers/lecturers.service';
import { Page } from '_common/dto/page.dto';
import { PatchUserRequestDto } from 'users/dto/patch-user.request.dto';
import { PatchUserResponseDto } from 'users/dto/patch-user.response.dto';
import { Role, isStudent } from '_common/enums/role.enum';
import { UserDto } from 'users/dto/user.dto';
import { UserId } from 'auth/decorators/user.decorators';
import { UsersService } from 'users/users.service';
import { ValidateUserIdPipe } from '_common/pipes/validate-user-id.pipe';
import { isEqual, isUndefined } from 'lodash';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly lecturersService: LecturersService,
  ) {}

  @Get('me')
  async getCurrentUser(@UserId() userId: number): Promise<UserDto> {
    const user = await this.usersService.findOneById(userId);
    return new UserDto(user, { role: Role.ADMIN });
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
    @Query() { role, page, size }: GetAllRequestDto,
  ): Promise<Page<UserDto>> {
    if (isUndefined(role) || isStudent(role)) {
      return new Page({ data: [], totalElements: 0 });
    }

    const pageable = { page, size };

    const [users, count] = await {
      [Role.ADMIN]: this.usersService.findAllAndCountAdmins(pageable),
      [Role.LECTURER]: this.lecturersService.findAllAndCount(pageable),
    }[role];

    const dtos = users.map((userable) => {
      if (userable instanceof Lecturer) {
        return new UserDto(userable.user, {
          role,
          scheduleId: userable.scheduleId,
        });
      }
      return new UserDto(userable, { role });
    });

    return new Page({
      data: dtos,
      totalElements: count,
    });
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
  async create(
    @Body() { role, ...dto }: CreateUserRequestDto,
  ): Promise<UserDto> {
    const protectedDto = await AuthService.withHashedPassword(dto);
    const user = await this.usersService.create({
      ...protectedDto,
      login: AuthService.generateLogin(),
      email: protectedDto.email ?? '',
      isAdmin: role === Role.ADMIN,
    });

    return new UserDto(user, { role });
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
