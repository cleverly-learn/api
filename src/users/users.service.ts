import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.save(user);
  }

  put(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ login });
  }
}
