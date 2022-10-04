import { IsGroupExistConstraint } from 'groups/validators/is-group-exist/is-group-exist.constraint';
import { registerDecorator } from 'class-validator';

export function IsGroupExist() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsGroupExistConstraint,
    });
  };
}
