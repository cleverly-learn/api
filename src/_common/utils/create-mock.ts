export function createMock<T, Args extends unknown[]>(object: {
  new (...args: Args): T;
}): Record<string, jest.Mock> {
  return Object.fromEntries(
    Object.getOwnPropertyNames(object.prototype).map((key) => [key, jest.fn()]),
  );
}
