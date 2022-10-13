import { FindOptionsSelect } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pageable } from '_common/types/pageable.interface';
import { PassThrough } from 'stream';
import { User } from 'users/entities/user.entity';
import { UsersRepository } from 'users/repositories/users.repository';
import ExcelJs from 'exceljs';

type PatchParams = Partial<Omit<User, 'id' | 'password'>>;
type PatchReturnValue = Pick<User, 'id'> & PatchParams;

type CreateParams = Partial<Omit<User, 'id'>> & Pick<User, 'login'>;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(user: CreateParams): Promise<User> {
    return this.usersRepository.save(user);
  }

  bulkPut(users: User[]): Promise<User[]> {
    return this.usersRepository.save(users);
  }

  async patch(id: number, user: PatchParams): Promise<PatchReturnValue> {
    return this.usersRepository.save({ id, ...user });
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.usersRepository.countBy({ id });
    return count > 0;
  }

  async existsByLogin(login: string): Promise<boolean> {
    const count = await this.usersRepository.countBy({ login });
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

  async createExcelFromUsers(users: User[]): Promise<PassThrough> {
    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet('Паролі');
    sheet.columns = [
      {
        header: 'ФІО',
        width: 30,
      },
      {
        header: 'Логін',
        width: 15,
      },
      {
        header: 'Пароль',
        width: 15,
      },
    ];
    const rows = users.map((user) => [
      `${user.lastName} ${user.firstName} ${user.patronymic}`,
      user.login,
      user.password,
    ]);
    sheet.addRows(rows);

    const stream = new PassThrough();
    await workbook.xlsx.write(stream);

    return stream;
  }

  async checkIsAdmin(id: number): Promise<boolean> {
    return this.usersRepository.checkIsAdmin(id);
  }

  findOneWithGoogleCredentials(
    id: number,
  ): Promise<Pick<User, 'googleRefreshToken'>> {
    return this.usersRepository.findOneWithGoogleCredentials(id);
  }
}
