export class Page<T> {
  data!: T[];

  totalElements!: number;

  constructor({ data, totalElements }: { data: T[]; totalElements: number }) {
    this.data = data;
    this.totalElements = totalElements;
  }
}
