import { range } from 'lodash';

function getRandomChar(
  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()',
): string {
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

export function generateRandomString(length: number): string {
  if (length <= 0) {
    return '';
  }

  return range(length).reduce((result) => `${result}${getRandomChar()}`, '');
}
