import { generateRandomString } from '_common/utils/random-string';

describe('randomString', () => {
  it('When: Length less or equal 0. Expected: Empty string', () => {
    expect(generateRandomString(0)).toBe('');
    expect(generateRandomString(-5)).toBe('');
  });

  it('When: Positive length provided. Expected: Correct length', () => {
    expect(generateRandomString(10).length).toBe(10);
  });

  it('When: Function called several times. Expected: Unique result each time', () => {
    [
      generateRandomString(10),
      generateRandomString(10),
      generateRandomString(10),
      generateRandomString(10),
      generateRandomString(10),
    ].forEach((str, i, results) =>
      expect(results.filter((value) => value === str).length).toBe(1),
    );
  });
});
