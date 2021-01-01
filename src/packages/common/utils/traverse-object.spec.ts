import { traverseObject } from './traverse-object';

describe('common/utils/traverse-object', () => {
  const dateFilter = (val: any): val is Date => val instanceof Date;
  const date1 = new Date();
  const date2 = new Date();

  it('should traverse object', () => {
    const dates = traverseObject(
      {
        date: date1,
        sub: {
          date1: date2,
        },
      },
      dateFilter,
    );
    expect(Array.from(dates)).toEqual([date1, date2]);
  });
  it('should handle null', () => {
    const nullResult = traverseObject(null, dateFilter);
    expect(Array.from(nullResult)).toEqual([]);
  });
  it('should handle undefined', () => {
    const nullResult = traverseObject(undefined, dateFilter);
    expect(Array.from(nullResult)).toEqual([]);
  });
  it('should handle nested null', () => {
    const nullResult = traverseObject({ sub: null }, dateFilter);
    expect(Array.from(nullResult)).toEqual([]);
  });
  it('should handle array', () => {
    const nullResult = traverseObject([date1, 'asd', 1, date2, null], dateFilter);
    expect(Array.from(nullResult)).toEqual([date1, date2]);
  });
  it('should handle nested array', () => {
    const nullResult = traverseObject({ sub: [date1, 'asd', date2, null] }, dateFilter);
    expect(Array.from(nullResult)).toEqual([date1, date2]);
  });
  it('should handle nested array with nested object', () => {
    const nullResult = traverseObject({ sub: [date1, 1, date2, { sub: date1 }] }, dateFilter);
    expect(Array.from(nullResult)).toEqual([date1, date2, date1]);
  });
  it('should handle regexp', () => {
    const nullResult = traverseObject({ sub: [date1, date2, 2, { regex: /[a-z]+/ }] }, dateFilter);
    expect(Array.from(nullResult)).toEqual([date1, date2]);
  });
});
