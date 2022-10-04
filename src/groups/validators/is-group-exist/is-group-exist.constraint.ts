import { GroupsService } from 'groups/groups.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsGroupExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly groupsService: GroupsService) {}

  async validate(value: number): Promise<boolean> {
    const exists = await this.groupsService.existsById(value);

    if (!exists) {
      throw new NotFoundException(`Group with id ${value} is not found`);
    }

    return exists;
  }
}
