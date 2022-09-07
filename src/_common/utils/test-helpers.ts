import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

interface Class<T, Args extends unknown[]> {
  new (...args: Args): T;
}

type MockedObject = Record<string, jest.Mock>;

/**
 * @example
 * const module: TestingModule = await Test.createTestingModule({
 *    providers: [
 *      {
 *        provide: Service,
 *        useValue: mockProvider(Service),
 *      },
 *    ],
 *  }).compile();
 */
export function mockProvider<T, Args extends unknown[]>(
  object: Class<T, Args>,
): MockedObject {
  return Object.fromEntries(
    Object.getOwnPropertyNames(object.prototype).map((key) => [key, jest.fn()]),
  );
}

/**
 * @example
 * const module: TestingModule = await Test.createTestingModule({
 *    providers: [mockNestProvider(Service)],
 *  }).compile();
 */
export function mockNestProvider<T, Args extends unknown[]>(
  object: Class<T, Args>,
): { provide: Class<T, Args>; useValue: MockedObject } {
  return {
    provide: object,
    useValue: mockProvider(object),
  };
}

/**
 * @example
 * const module: TestingModule = await Test.createTestingModule({
 *    providers: [mockNestRepository(Entity)],
 *  }).compile();
 */
export function mockNestRepository(entity: EntityClassOrSchema): {
  provide: ReturnType<typeof getRepositoryToken>;
  useValue: MockedObject;
} {
  return {
    provide: getRepositoryToken(entity),
    useValue: mockProvider(Repository),
  };
}
