import { GroupsService } from 'groups/groups.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class AreGroupExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly groupsService: GroupsService) {}

  async validate(values: number[]): Promise<boolean> {
    const exists = await this.groupsService.existsByIds(...values);

    if (!exists) {
      throw new NotFoundException(
        `Some of groups with ids ${values.join(',')} are not found`,
      );
    }

    return exists;
  }
}
