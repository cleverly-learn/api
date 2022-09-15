import { getPageableFindOptions } from '_common/utils/get-pageable-find-options';

describe('getPageableFindOptions', () => {
  it('When: Passed undefined. Expected: Empty object', () => {
    expect(getPageableFindOptions()).toEqual({});
  });

  it('When: Page greater that 0, size undefined. Expected: Empty object', () => {
    expect(getPageableFindOptions({ page: 1 })).toEqual({});
  });

  it('When: Page 1, size 0. Expected: Skip 0, take 0', () => {
    expect(getPageableFindOptions({ page: 1, size: 0 })).toEqual({
      skip: 0,
      take: 0,
    });
  });

  it('When: Page 2, size 5. Expected: Skip 10, take 5', () => {
    expect(getPageableFindOptions({ page: 2, size: 5 })).toEqual({
      skip: 10,
      take: 5,
    });
  });

  it('When: Page undefined, size 5. Expected: Skip 0, take 5', () => {
    expect(getPageableFindOptions({ size: 5 })).toEqual({
      skip: 0,
      take: 5,
    });
  });

  it('When: Negative values. Expected: Empty object', () => {
    expect(getPageableFindOptions({ size: -5 })).toEqual({});
    expect(getPageableFindOptions({ page: -5 })).toEqual({});
  });
});
