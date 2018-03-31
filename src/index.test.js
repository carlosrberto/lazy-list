import lazy from './index';

describe('LazyList.map', () => {
  it('should map array with number values', () => {
    const mapFn = v => v * 2;
    const list = [1, 2, 3];
    const mapped = [2, 4, 6];
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });

  it('should map array with string values', () => {
    const mapFn = v => v.toUpperCase();
    const list = ['js', 'functional', 'programming'];
    const mapped = ['JS', 'FUNCTIONAL', 'PROGRAMMING'];
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });

  it('should map array with object values', () => {
    const mapFn = v => v.name;
    const list = [{ name: 'Charles' }, { name: 'John' }];
    const mapped = ['Charles', 'John'];
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });

  it('should map array with 0 values', () => {
    const mapFn = v => v * 2;
    const list = [0, 2, 0];
    const mapped = [0, 4, 0];
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });

  it('should map array with null values', () => {
    const mapFn = v => v * 2;
    const list = [null, 2, null];
    const mapped = [0, 4, 0];
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });

  it('should map array with undefined values', () => {
    const mapFn = v => v * 2;
    const list = [NaN, 4, NaN];
    const mapped = list.map(mapFn);
    const lazyMapped = lazy(list).map(mapFn).value();
    expect(lazyMapped).toEqual(mapped);
  });
});
