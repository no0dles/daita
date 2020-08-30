import { expectedSql } from './formatter.test';

describe('create-schema', () => {
  it('should create schema', () => {
    expectedSql({
      createSchema: 'auth',
    }, 'CREATE SCHEMA "auth"');
  });
  it('should create schema if not exists', () => {
    expectedSql({
      createSchema: 'auth',
      ifNotExists: true,
    }, 'CREATE SCHEMA IF NOT EXISTS "auth"');
  });
});
