import { getTotalPages } from '_common/utils/get-total-pages';
import { isUndefined } from 'lodash';

export class Page<T> {
  data!: T[];

  totalElements!: number;

  totalPages?: number;

  constructor({
    data,
    totalElements,
    size,
  }: {
    data: T[];
    totalElements: number;
    size?: number;
  }) {
    this.data = data;
    this.totalElements = totalElements;
    this.totalPages = isUndefined(size)
      ? undefined
      : getTotalPages(totalElements, size);
  }
}
