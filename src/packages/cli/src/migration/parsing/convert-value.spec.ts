import { getJavascriptFilename } from './convert-value';

describe('cli/migration/convert-value', () => {
  it('should convert filename from .d.ts to .js', () => {
    expect(getJavascriptFilename('test.d.ts')).toBe('test.js');
  });
  it('should keep js filename', () => {
    expect(getJavascriptFilename('test.js')).toBe('test.js');
  });
});
