import { Symbols, randomString } from '_common/utils/random-string';
import { intersection, uniq } from 'lodash';

describe('randomString', () => {
  it('When: Length less or equal 0. Expected: Empty string', () => {
    expect(randomString(0)).toBe('');
    expect(randomString(-5)).toBe('');
  });

  it('When: Positive length provided. Expected: Correct length', () => {
    expect(randomString(10).length).toBe(10);
  });

  it('When: Function called several times. Expected: Unique result each time', () => {
    const results = [
      randomString(10),
      randomString(10),
      randomString(10),
      randomString(10),
      randomString(10),
    ];

    expect(results.length).toBe(uniq(results).length);
  });

  it('When: No symbols set provided. Expected: All symbols mixed', () => {
    const actualSymbols = randomString(1000).split('');

    expect(
      intersection(actualSymbols, Symbols.LATIN_LETTERS.split('')).length,
    ).not.toBe(0);
    expect(
      intersection(actualSymbols, Symbols.NUMBERS.split('')).length,
    ).not.toBe(0);
    expect(
      intersection(actualSymbols, Symbols.SPECIAL_CHARACTERS.split('')).length,
    ).not.toBe(0);
  });

  it('When: Specific characters provided. Expected: Only this characters exists', () => {
    const actualSymbols = randomString(1000, Symbols.NUMBERS).split('');

    expect(intersection(actualSymbols, Symbols.NUMBERS.split('')).length).toBe(
      Symbols.NUMBERS.length,
    );
    expect(
      intersection(actualSymbols, Symbols.LATIN_LETTERS.split('')).length,
    ).toBe(0);
    expect(
      intersection(actualSymbols, Symbols.SPECIAL_CHARACTERS.split('')).length,
    ).toBe(0);
  });
});
