import { getTotalPages } from '_common/utils/get-total-pages';

describe('getTotalPages', () => {
  it('When: Total elements is less or equal page size. Expected: 0', () => {
    expect(getTotalPages(5, 10)).toBe(0);
  });

  it('When: Total elements less than size and size 0. Expected: 0', () => {
    expect(getTotalPages(10, 0)).toBe(0);
    expect(getTotalPages(0, 0)).toBe(0);
    expect(getTotalPages(10, 10)).toBe(0);
  });

  it('When: Total elements 9, page size 4. Expected: 0', () => {
    expect(getTotalPages(9, 4)).toBe(2);
  });
});
