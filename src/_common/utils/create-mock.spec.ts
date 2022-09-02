import { createMock } from '_common/utils/create-mock';

class TestClass {
  function1() {
    return 1;
  }

  function2() {
    return 2;
  }
}

describe('createMock', () => {
  it('When: Class provided. Expected: Methods mocks', () => {
    const testInstance = new TestClass();

    const actual = createMock(TestClass);

    expect(Object.keys(actual)).toEqual([
      'constructor',
      'function1',
      'function2',
    ]);
    expect(typeof actual.function1).toBe('function');
    expect(typeof actual.function2).toBe('function');
    expect(actual.function1()).not.toBe(testInstance.function1());
    expect(actual.function1()).not.toBe(testInstance.function2());
  });
});
