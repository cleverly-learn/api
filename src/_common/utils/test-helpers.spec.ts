/* eslint-disable max-classes-per-file */
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockClass,
  mockProvider,
  mockRepository,
} from '_common/utils/test-helpers';

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
    });
  });
});
