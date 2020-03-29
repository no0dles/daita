import {dataAdapter} from '../data-adapter';
import {User} from '../tables';
import {select, SqlSelect} from '@daita/core';

describe('select/where', () => {
  it('should select with where condition', () => {
    const sql = select(dataAdapter, User)
      .where({
        username: 'admin',
      })
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      where: {
        left: {field: 'username'},
        operand: '=',
        right: 'admin',
      },
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select with or condition', () => {
    const sql = select(dataAdapter, User)
      .where({
        $or: [{username: 'admin'}, {email: 'admin@daita.ch'}],
      })
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      where: {
        or: [
          {
            left: {field: 'username'},
            operand: '=',
            right: 'admin',
          },
          {
            left: {field: 'email'},
            operand: '=',
            right: 'admin@daita.ch',
          },
        ],
      },
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select with or and and condition', () => {
    const sql = select(dataAdapter, User)
      .where({
        $or: [
          {$and: [{username: 'admin'}, {username: 'adminstrator'}]},
          {email: 'admin@daita.ch'}
        ],
      })
      .toSql();

    const expectedSql: SqlSelect = {
      select: [{table: 'user', all: true}],
      from: {
        table: 'user',
      },
      where: {
        or: [
          {
            and: [
              {
                left: {field: 'username'},
                operand: '=',
                right: 'admin',
              },
              {
                left: {field: 'username'},
                operand: '=',
                right: 'administrator',
              },
            ],
          },
          {
            left: {field: 'email'},
            operand: '=',
            right: 'admin@daita.ch',
          },
        ],
      },
    };
    expect(sql).toEqual(expectedSql);
  });
});