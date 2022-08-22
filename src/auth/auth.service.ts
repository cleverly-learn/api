import { Injectable } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.createDefaultAdminIfNeeded();
  }

  async createDefaultAdminIfNeeded(): Promise<void> {
    const defaultAdmin = await this.usersService.findOneById(1);

    if (defaultAdmin) {
      return;
    }

    const defaultName = 'admin';

    await this.usersService.put({
      id: 1,
      login: defaultName,
      password: await AuthService.hash(defaultName),
      firstName: defaultName,
      lastName: '',
      patronymic: '',
      email: '',
      isAdmin: true,
      isRegistered: true,
    });
  }

  static hash(str: string): Promise<string> {
    return bcrypt.hash(str, 10);
  }

  async register({ password, ...user }: Omit<User, 'id'>): Promise<User> {
    return this.usersService.create({
      ...user,
      password: await AuthService.hash(password),
    });
  }
}
