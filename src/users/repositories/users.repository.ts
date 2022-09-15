import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { User } from 'users/entities/user.entity';
import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(User, entityManager);
  }

  findAllAdmins(page?: Pageable): Promise<User[]> {
    return this.repository.find({
      where: { isAdmin: true },
      ...getPageableFindOptions(page),
    });
  }
}
