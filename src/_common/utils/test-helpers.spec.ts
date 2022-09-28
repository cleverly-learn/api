/* eslint-disable max-classes-per-file */
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockClass,
  mockProvider,
  mockRepository,
  mockRepositoryProvider,
} from '_common/utils/test-helpers';
import { uniq } from 'lodash';

class TestProvider {
  function1() {
    return 1;
  }

  function2() {
    return 2;
  }
}

class TestEntity {
  property1!: string;

  property2!: number;
}

class TestRepositoryProvider extends Repository<TestEntity> {
  constructor() {
    super(TestEntity, {} as EntityManager);
  }

  function1() {
    return 1;
  }
}

describe('test-helpers', () => {
  describe('mockClass', () => {
    it('When: Class provided. Expected: Methods mocks', () => {
      const testInstance = new TestProvider();

      const actual = mockClass(TestProvider);

      expect(Object.keys(actual)).toEqual(
        Object.getOwnPropertyNames(TestProvider.prototype),
      );
      Object.keys(actual)
        .filter((key) => key !== 'constructor')
        .forEach((key) => {
          expect(typeof actual[key]).toBe('function');
          expect(actual[key]()).not.toBe(
            testInstance[key as keyof TestProvider](),
          );
        });
      expect(Object.keys(actual).includes('function1')).toBe(true);
    });
  });

  describe('mockProvider', () => {
    it('When: Provider provided. Expected: Mocked provider', () => {
      const testInstance = new TestProvider();

      const actual = mockProvider(TestProvider);

      expect(actual).toEqual({
        provide: TestProvider,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        useValue: expect.anything(),
      });
      const actualValue = actual.useValue;
      expect(Object.keys(actualValue)).toEqual(
        Object.getOwnPropertyNames(TestProvider.prototype),
      );
      Object.keys(actualValue)
        .filter((key) => key !== 'constructor')
        .forEach((key) => {
          expect(typeof actualValue[key]).toBe('function');
          expect(actualValue[key]()).not.toBe(
            testInstance[key as keyof TestProvider](),
          );
        });
      expect(Object.keys(actualValue).includes('function1')).toBe(true);
    });
  });

  describe('mockRepository', () => {
    it('When: Entity provided. Expected: Mocked provider', () => {
      const actual = mockRepository(TestEntity);

      expect(actual).toEqual({
        provide: getRepositoryToken(TestEntity),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        useValue: expect.anything(),
      });
      const actualValue = actual.useValue;
      expect(Object.keys(actualValue)).toEqual(
        Object.getOwnPropertyNames(Repository.prototype),
      );
      expect(Object.keys(actualValue).includes('find')).toBe(true);
    });
  });

  describe('mockRepositoryProvider', () => {
    it('When: Provider provided. Expected: Mocked provider with repository methods', () => {
      const actual = mockRepositoryProvider(TestRepositoryProvider);

      expect(actual).toEqual({
        provide: TestRepositoryProvider,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        useValue: expect.anything(),
      });
      const actualValue = actual.useValue;
      expect(Object.keys(actualValue)).toEqual(
        uniq(
          Object.getOwnPropertyNames(Repository.prototype).concat(
            Object.getOwnPropertyNames(TestRepositoryProvider.prototype),
          ),
        ),
      );
      expect(Object.keys(actualValue).includes('find')).toBe(true);
      expect(Object.keys(actualValue).includes('function1')).toBe(true);
    });
  });
});
