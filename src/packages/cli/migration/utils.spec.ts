import { getMigrationName } from './utils';

describe('utils', () => {
  it('migration name abc-def', () => {
    expect(getMigrationName('abc-def')).toBe('AbcDefMigration');
  });
  it('migration name abc', () => {
    expect(getMigrationName('abc')).toBe('AbcMigration');
  });
  it('migration name abc.def', () => {
    expect(getMigrationName('abc.def')).toBe('AbcDefMigration');
  });
});
