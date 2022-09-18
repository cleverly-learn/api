import { FindOptionsSelect } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/repositories/users.repository';

type PatchParams = Partial<
  Pick<User, 'firstName' | 'lastName' | 'patronymic' | 'login' | 'password'>
>;
type PatchReturnValue = Partial<Pick<User, 'id'>> &
  Omit<PatchParams, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.save(user);
  }

  put(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async patch(id: number, user: PatchParams): Promise<PatchReturnValue> {
    return this.usersRepository.save({ id, ...user });
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.usersRepository.countBy({ id });
    return count > 0;
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  findOneByLogin(
    login: string,
    select?: FindOptionsSelect<User>,
  ): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login }, select });
  }

  findAllAndCountAdmins(pageable?: Pageable): Promise<[User[], number]> {
    return this.usersRepository.findAllAndCountAdmins(pageable);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
