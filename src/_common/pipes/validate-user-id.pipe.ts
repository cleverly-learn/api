import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UsersService } from 'users/users.service';

@Injectable()
export class ValidateUserIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: number): Promise<number> {
    const exists = await this.usersService.existsById(value);

    if (!exists) {
      throw new NotFoundException(`User with id ${value} is not found`);
    }

    return value;
  }
}
