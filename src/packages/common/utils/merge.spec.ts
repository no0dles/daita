import { merge } from './merge';

describe('utils/merge', () => {
  it('should find added', () => {
    const source: string[] = [];
    const target = ['foo', 'bar'];
    const result = merge(source, target, (first, second) => first === second);
    expect(result.added).toEqual(['foo', 'bar']);
    expect(result.merge).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(source).toHaveLength(0);
    expect(target).toHaveLength(2);
  });

  it('should find removed/merged/added', () => {
    const source = ['foo', 'bar'];
    const target = ['foo', 'foobar'];
    const result = merge(source, target, (first, second) => first === second);
    expect(result.added).toEqual(['foobar']);
    expect(result.merge).toEqual([{ current: 'foo', target: 'foo' }]);
    expect(result.removed).toEqual(['bar']);
    expect(source).toHaveLength(2);
    expect(target).toHaveLength(2);
  });
});
