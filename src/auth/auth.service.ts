import { Injectable } from '@nestjs/common';
import { User } from 'users/entities/user.entity';
import { UsersService } from 'users/users.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({ password, ...user }: Omit<User, 'id'>): Promise<User> {
    return this.usersService.create({
      ...user,
      password: await hash(password, 10),
    });
  }
}
