export function getTotalPages(totalElements: number, pageSize: number): number {
  if (pageSize === 0 || totalElements <= pageSize) {
    return 0;
  }

  return Math.floor(totalElements / pageSize);
}
