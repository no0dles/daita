import { isFieldDescription } from './field-description';
import { table } from '../table/table';

describe('field', () => {
  it('should allow chars inside of whitelist', () => {
    expect(isFieldDescription({ field: { key: 'a_A_0', table: table('foo') } })).toBeTruthy();
  });

  it('should not allow chars outside of whitelist', () => {
    expect(isFieldDescription({ field: { key: '-', table: table('foo') } })).toBeFalsy();
    expect(isFieldDescription({ field: { key: '/', table: table('foo') } })).toBeFalsy();
    expect(isFieldDescription({ field: { key: '\\', table: table('foo') } })).toBeFalsy();
  });
});
