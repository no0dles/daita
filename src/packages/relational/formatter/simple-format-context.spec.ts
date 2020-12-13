import { SimpleFormatContext } from './simple-format-context';
import { FormatDataType } from './format-context';

describe('simple-format-context', () => {
  class TestContext extends SimpleFormatContext {
    constructor() {
      super('?', '`');
    }

    getDataType(options: FormatDataType): string {
      return options.type;
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
