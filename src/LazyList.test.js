import lazy from './index';
import LazyList, { LIST_OPERATIONS } from './LazyList';

describe('LazyList.constructor', () => {
  it('should throw when invalid list is provided', () => {
    expect(() => {
      const list = () => new LazyList(null);
      list();
    }).toThrowError('Invalid list argument');
  });

  it('should throw when invalid operations is provided', () => {
    expect(() => {
      const list = () => new LazyList([], null);
      list();
    }).toThrowError('Invalid operations argument');
  });
});

describe('LazyList.createOperation', () => {
  it('should throw when invalid operation is provided', () => {
    expect(() => {
      lazy([1]).createOperation('invalid', v => v + 1);
    }).toThrowError('Invalid operation type argument');
  });

  it('should throw when invalid callback is provided', () => {
    expect(() => {
      lazy([1]).createOperation(LIST_OPERATIONS.MAP, null);
    }).toThrowError('Invalid callback argument');
  });

  it('should return new Instance of LazyList', () => {
    const l1 = lazy([1]);
    const l2 = l1.createOperation(LIST_OPERATIONS.MAP, v => v + 1);
    expect(l2).not.toBe(l1);
  });

  it('should store operation', () => {
    const fn = v => v + 1;
    const l1 = lazy([1]).createOperation(LIST_OPERATIONS.MAP, fn);
    expect(l1.operations).toHaveLength(1);
    expect(l1.operations[0].type).toEqual(LIST_OPERATIONS.MAP);
    expect(l1.operations[0].fn).toEqual(fn);
  });

  it('should store previous operation', () => {
    const l1 = lazy([1]);
    const l2 = l1.createOperation(LIST_OPERATIONS.MAP, v => v + 1);
    const l3 = l2.createOperation(LIST_OPERATIONS.MAP, v => v + 1);

    expect(l1.operations).toHaveLength(0);
    expect(l2.operations).toHaveLength(1);
    expect(l3.operations).toHaveLength(2);
  });
});

describe('LazyList.map', () => {
  it('should pass value and index as arguments', () => {
    const fn = jest.fn();
    lazy([1, 2]).map((v, i) => {
      fn(v, i);
      return v + 1;
    }).value();
    expect(fn).toBeCalledWith(1, 0);
    expect(fn).toBeCalledWith(2, 1);
  });

  it('should map value correctly', () => {
    expect(lazy([1]).map(v => v + 1).value()).toEqual([2]);
    expect(lazy([0]).map(v => v * 2).value()).toEqual([0]);
    expect(lazy([null]).map(v => v * 2).value()).toEqual([0]);
    expect(lazy([NaN]).map(v => v * 2).value()).toEqual([NaN]);
    expect(lazy([undefined]).map(v => v * 2).value()).toEqual([NaN]);
    expect(lazy([{ name: 'Joe' }]).map(v => v.name).value()).toEqual(['Joe']);
  });

  it('should work with multiple map calls', () => {
    expect(lazy([' Joe ', ' Dog '])
      .map(v => v.toUpperCase())
      .map(v => v.trim())
      .value()).toEqual(['Joe', 'Dog']);
  });
});

describe('LazyList.filter', () => {
  it('should filter value correctly', () => {
    expect(lazy([0, 1, 2]).filter(v => v > 0).value()).toEqual([1, 2]);
    expect(lazy([0, true, false]).filter(v => !!v).value()).toEqual([true]);
    expect(lazy([
      { name: 'Joe', age: 3 },
      { name: 'Spike', age: 16 },
    ]).filter(v => v.age > 10).value()).toEqual([{ name: 'Spike', age: 16 }]);
  });

  it('should work with multiple filter calls', () => {
    expect(lazy([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .filter(v => v > 2)
      .filter(v => v < 8)
      .value()).toEqual([3, 4, 5, 6, 7]);
  });
});

describe('LazyList.reduce', () => {
  it('should reduce to correctly value', () => {
    expect(lazy([1, 2, 3]).reduce((a, b) => a + b)).toEqual(6);
    expect(lazy([0, 0]).reduce((a, b) => a + b)).toEqual(0);
  });

  it('should reduce to correctly value when provide initial value', () => {
    expect(lazy([1, 2, 3]).reduce((a, b) => a + b, 1)).toEqual(7);

    expect(lazy([
      { value: 1 },
      { value: 2 },
    ]).reduce((acc, b) => (
      { value: acc.value + b.value }
    ), { value: 0 })).toEqual({ value: 3 });

    expect(lazy([
      { value: 1 },
      { value: 2 },
    ]).reduce((acc, b) => acc + b.value, 0)).toEqual(3);
  });
});
