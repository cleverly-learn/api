import { AreGroupExistConstraint } from 'groups/validators/are-groups-exist/are-groups-exist.constraint';
import { registerDecorator } from 'class-validator';

export function AreGroupsExist() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: AreGroupExistConstraint,
    });
  };
}
