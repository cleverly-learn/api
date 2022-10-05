import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { User } from 'users/entities/user.entity';
import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(entityManager: EntityManager) {
    super(User, entityManager);
  }

  findAllAndCountAdmins(pageable?: Pageable): Promise<[User[], number]> {
    return this.findAndCount({
      where: { isAdmin: true },
      order: { id: 'ASC' },
      ...getPageableFindOptions(pageable),
    });
  }

  async checkIsAdmin(id: number): Promise<boolean> {
    const user = await this.findOne({
      where: { id },
      select: { isAdmin: true },
    });
    return Boolean(user);
  }
}
