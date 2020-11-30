import { SimpleFormatContext } from './simple-format-context';

describe('simple-format-context', () => {
  class TestContext extends SimpleFormatContext {
    constructor() {
      super('?', '`');
    }

    getDataType(type: string): string {
      return type;
    }
  }

  it('should add values', () => {
    const ctx = new TestContext();
    expect(ctx.appendValue('a')).toBe('?');
    expect(ctx.getValues()).toEqual(['a']);
  });

  it('should escape', () => {
    const ctx = new TestContext();
    expect(ctx.escape('test')).toEqual('`test`');
  });

  it('should add values with duplicates', () => {
    const ctx = new TestContext();
    expect(ctx.appendValue('a')).toBe('?');
    expect(ctx.appendValue('a')).toBe('?');
    expect(ctx.getValues()).toEqual(['a', 'a']);
  });
});
