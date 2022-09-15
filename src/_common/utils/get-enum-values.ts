import { isNumber } from 'lodash';

export function getEnumNumericValues(entity: object): number[] {
  return Object.values(entity).filter((value) => isNumber(value)) as number[];
}
