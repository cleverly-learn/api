import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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

  findOneByLogin(
    login: string,
    select?: FindOptionsSelect<User>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login }, select });
  }
}
