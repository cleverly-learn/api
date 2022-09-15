import { getEnumNumericValues } from '_common/utils/get-enum-values';

enum Test {
  A = 2,
  B = 5,
  C = 6,
}

describe('getEnumNumericValues', () => {
  it('Expected: Value', () => {
    expect(getEnumNumericValues(Test)).toEqual([2, 5, 6]);
  });
});
