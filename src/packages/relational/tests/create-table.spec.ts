import { expectedSql } from './formatter.test';
import { table } from '../sql/function/table';

describe('create-table', () => {
  it('should create table with primary key', () => {
    expectedSql(
      {
        createTable: table('user', 'auth'),
        columns: [
          { name: 'id', primaryKey: true, type: 'VARCHAR', notNull: true },
        ],
      },
      'CREATE TABLE "auth"."user" ("id" VARCHAR NOT NULL, PRIMARY KEY ("id"))',
    );
  });

  it('should create table without primary key', () => {
    expectedSql(
      {
        createTable: table('user'),
        columns: [{ name: 'id', type: 'VARCHAR' }],
      },
      'CREATE TABLE "user" ("id" VARCHAR)',
    );
  });

  it('should create table if not exists', () => {
    expectedSql(
      {
        createTable: table('user'),
        ifNotExists: true,
        columns: [{ name: 'id', type: 'VARCHAR' }],
      },
      'CREATE TABLE IF NOT EXISTS "user" ("id" VARCHAR)',
    );
  });
});
