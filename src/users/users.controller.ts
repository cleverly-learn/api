import { AddGmailBodyDto } from 'users/dto/add-gmail.body.dto';
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
import { GoogleService } from 'google/google.service';
import { JwtAuthGuard } from '_common/guards/jwt-auth.guard';
import { Lecturer } from 'lecturers/entities/lecturer.entity';
import { LecturersService } from 'lecturers/lecturers.service';
import { Page } from '_common/dto/page.dto';
import { PatchUserRequestDto } from 'users/dto/patch-user.request.dto';
import { PatchUserResponseDto } from 'users/dto/patch-user.response.dto';
import { Role, isAdmin, isLecturer, isStudent } from '_common/enums/role.enum';
import { Roles } from '_common/decorators/roles.decorator';
import { Student } from 'students/entities/student.entity';
import { StudentsService } from 'students/students.service';
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
    private readonly studentsService: StudentsService,
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @Get('me')
  getCurrentUser(@UserId() userId: number): Promise<UserDto> {
    return this.get(userId);
  }

  @Get(':id')
  async get(@Param('id', ValidateUserIdPipe) id: number): Promise<UserDto> {
    const role = await this.authService.getRoleByUserId(id);

    if (isAdmin(role)) {
      const user = await this.usersService.findOneById(id);
      return new UserDto(user, { role });
    }
    if (isLecturer(role)) {
      const lecturer = await this.lecturersService.findOneByUserId(id);
      return new UserDto(lecturer.user, {
        role,
        scheduleId: lecturer.scheduleId,
      });
    }
    if (isStudent(role)) {
      const student = await this.studentsService.findOneByUserId(id);
      return new UserDto(student.user, {
        role,
        scheduleId: student.group.scheduleId,
        group: student.group,
      });
    }

    throw new BadRequestException('Invalid user provided');
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAll(
    @Query() { role, page, size }: GetAllRequestDto,
  ): Promise<Page<UserDto>> {
    if (isUndefined(role)) {
      return new Page({ data: [], totalElements: 0 });
    }

    const pageable = { page, size };

    const [users, count] = await {
      [Role.ADMIN]: this.usersService.findAllAndCountAdmins(pageable),
      [Role.LECTURER]: this.lecturersService.findAllAndCount(pageable),
      [Role.STUDENT]: this.studentsService.findAllAndCount(pageable),
    }[role];

    const dtos = users.map((userable) => {
      if (userable instanceof Lecturer) {
        return new UserDto(userable.user, {
          role,
          scheduleId: userable.scheduleId,
        });
      }
      if (userable instanceof Student) {
        return new UserDto(userable.user, {
          role,
          scheduleId: userable.group.scheduleId,
        });
      }
      return new UserDto(userable, { role });
    });

    return new Page({
      data: dtos,
      totalElements: count,
    });
  }

  @Patch('me')
  async patchCurrentUser(
    @UserId() userId: number,
    @Body() patchUserDto: PatchUserRequestDto,
  ): Promise<PatchUserResponseDto> {
    return this.patch(userId, patchUserDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async patch(
    @Param('id', ValidateUserIdPipe) id: number,
    @Body() patchUserDto: PatchUserRequestDto,
  ): Promise<PatchUserResponseDto> {
    const protectedDto = await AuthService.withHashedPassword(patchUserDto);
    const user = await this.usersService.patch(id, protectedDto);

    return new PatchUserResponseDto(user);
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() { role, ...dto }: CreateUserRequestDto,
  ): Promise<UserDto> {
    const protectedDto = await AuthService.withHashedPassword(dto);
    const user = await this.usersService.create({
      ...protectedDto,
      login: AuthService.generateLogin(),
      email: protectedDto.email ?? '',
      isAdmin: isAdmin(role),
    });

    return new UserDto(user, { role });
  }

  @Roles(Role.ADMIN)
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

  @Post('me/google')
  async connectGoogle(
    @UserId() userId: number,
    @Body() { code }: AddGmailBodyDto,
  ): Promise<string> {
    const { accessToken, refreshToken, email } =
      await this.googleService.getTokenInfo(code);
    await this.usersService.patch(userId, {
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      email,
    });
    return email;
  }
}
