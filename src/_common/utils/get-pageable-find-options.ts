import { FindManyOptions } from 'typeorm';
import { Pageable } from '_common/types/pageable.interface';
import { isUndefined } from 'lodash';

export function getPageableFindOptions(
  pageable?: Pageable,
): Pick<FindManyOptions, 'skip' | 'take'> {
  if (isUndefined(pageable)) {
    return {};
  }
  const { page, size } = pageable;
  if (isUndefined(size) || (page && page < 0) || size < 0) {
    return {};
  }

  return {
    skip: (page ?? 0) * size,
    take: size,
  };
}
