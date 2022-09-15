import { range } from 'lodash';

export enum Symbols {
  LATIN_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS = '0123456789',
  SPECIAL_CHARACTERS = '!@#$%^&*()',
}
const ALL_SYMBOLS = `${Symbols.LATIN_LETTERS}${Symbols.NUMBERS}${Symbols.SPECIAL_CHARACTERS}`;

function getRandomChar(chars = ALL_SYMBOLS): string {
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

export function generateRandomString(
  length: number,
  symbols?: Symbols,
): string {
  if (length <= 0) {
    return '';
  }

  return range(length).reduce(
    (result) => `${result}${getRandomChar(symbols)}`,
    '',
  );
}
