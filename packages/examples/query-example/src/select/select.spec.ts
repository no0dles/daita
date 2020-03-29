import {select, SqlSelect} from '@daita/core';
import {User} from './tables';
import {dataAdapter} from './data-adapter';

describe('select', () => {
  it('should select all', () => {
    const sql = select(dataAdapter, User)
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
    };
    expect(sql).toEqual(expectedSql);
  });
});