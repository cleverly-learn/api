import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import { ValueProvider } from '@nestjs/common';
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
 *        useValue: mockClass(Service),
 *      },
 *    ],
 *  }).compile();
 */
export function mockClass<T, Args extends unknown[]>(
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
export function mockProvider<T, Args extends unknown[]>(
  object: Class<T, Args>,
): ValueProvider<MockedObject> {
  return {
    provide: object,
    useValue: mockClass(object),
  };
}

/**
 * @example
 * const module: TestingModule = await Test.createTestingModule({
 *    providers: [mockNestRepository(Entity)],
 *  }).compile();
 */
export function mockRepository(
  entity: EntityClassOrSchema,
): ValueProvider<MockedObject> {
  return {
    provide: getRepositoryToken(entity),
    useValue: mockClass(Repository),
  };
}

export function mockRepositoryProvider<T, Args extends unknown[]>(
  object: Class<T, Args>,
): ValueProvider<MockedObject> {
  return {
    provide: object,
    useValue: {
      ...mockClass(Repository),
      ...mockClass(object),
    },
  };
}
