import { Injectable, PipeTransform } from '@nestjs/common';
import { IsGroupExistConstraint } from 'groups/validators/is-group-exist/is-group-exist.constraint';

@Injectable()
export class ValidateGroupIdPipe implements PipeTransform {
  constructor(
    private readonly isGroupExistsConstraint: IsGroupExistConstraint,
  ) {}

  async transform(value: number): Promise<number> {
    await this.isGroupExistsConstraint.validate(value);
    return value;
  }
}
