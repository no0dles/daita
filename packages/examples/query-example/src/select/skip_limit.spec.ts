import {dataAdapter} from '../data-adapter';
import {User} from '../tables';
import {select, SqlSelect} from '@daita/core';

describe('select/skip_limit', () => {

  it('should select first 100', () => {
    const sql = select(dataAdapter, User)
      .limit(100)
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      limit: 100,
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select skip first 100', () => {
    const sql = select(dataAdapter, User)
      .skip(100)
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      offset: 100,
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select 10 after the first 100', () => {
    const sql = select(dataAdapter, User)
      .limit(10)
      .skip(100)
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      limit: 10,
      offset: 100,
    };
    expect(sql).toEqual(expectedSql);
  });
});