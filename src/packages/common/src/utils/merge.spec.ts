import { mergeArray } from './merge';

describe('utils/mergeArray', () => {
  it('should find added', () => {
    const source: string[] = [];
    const target = ['foo', 'bar'];
    const result = mergeArray(source, target);
    expect(result.added).toEqual(['foo', 'bar']);
    expect(result.removed).toEqual([]);
    expect(source).toHaveLength(0);
    expect(target).toHaveLength(2);
  });

  it('should find removed/merged/added', () => {
    const source = ['foo', 'bar'];
    const target = ['foo', 'foobar'];
    const result = mergeArray(source, target);
    expect(result.added).toEqual(['foobar']);
    expect(result.removed).toEqual(['bar']);
    expect(source).toHaveLength(2);
    expect(target).toHaveLength(2);
  });
});
