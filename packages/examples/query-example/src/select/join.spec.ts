import {dataAdapter} from '../data-adapter';
import {Role, User, UserRole} from '../tables';
import {select, SqlSelect} from '@daita/core';

describe('select/join', () => {
  it('should select with joined table', () => {
    const sql = select(dataAdapter, UserRole)
      .join(User, 'user', on => on.eq(ur => ur.userUsername, ur => ur.user.username))
      .toSql();

    const expectedSql: SqlSelect = {
      select: [
        {table: 'user_role', all: true},
        {table: 'user', all: true},
      ],
      from: {
        table: 'user_role',
      },
      joins: [
        {
          type: 'inner',
          from: {table: 'user', alias: 'user'},
          on: {
            left: {field: 'userUsername', table: 'user_role'},
            operand: '=',
            right: {field: 'username', table: 'user'},
          },
        },
      ],
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select with multiple joins', () => {
    const sql = select(dataAdapter, UserRole)
      .join(User, 'user', on => on.eq(ur => ur.userUsername, ur => ur.user.username))
      .join(Role, 'role', on => on.eq(ur => ur.roleName, ur => ur.role.name))
      .toSql();

    const expectedSql: SqlSelect = {
      select: [
        {table: 'user_role', all: true},
        {table: 'user', all: true},
        {table: 'role', all: true},
      ],
      from: {
        table: 'user_role',
      },
      joins: [
        {
          type: 'inner',
          from: {table: 'user', alias: 'user'},
          on: {
            left: {field: 'userUsername', table: 'user_role'},
            operand: '=',
            right: {field: 'username', table: 'user'},
          },
        },
        {
          type: 'inner',
          from: {table: 'role', alias: 'role'},
          on: {
            left: {field: 'roleName', table: 'user_role'},
            operand: '=',
            right: {field: 'name', table: 'role'},
          },
        },
      ],
    };
    expect(sql).toEqual(expectedSql);
  });

  it('should select with self referencing table', () => {
    const sql = select(dataAdapter, User)
      .join(User, 'parent', on => on.eq(u => u.parentUsername, u => u.parent.username))
      .join(User, 'parent.parent', on => on.eq(u => u.parent.parentUsername, u => u.parent.parent.username))
      .toSql();

    const expectedSql: SqlSelect = {
      select: [
        {table: 'user', all: true},
        {table: 'parent', all: true},
        {table: 'parent.parent', all: true},
      ],
      from: {
        table: 'user',
      },
      joins: [
        {
          type: 'inner',
          from: {table: 'user', alias: 'parent'},
          on: {
            left: {field: 'parentUsername', table: 'user'},
            operand: '=',
            right: {field: 'username', table: 'parent'},
          },
        },
        {
          type: 'inner',
          from: {table: 'user', alias: 'parent.parent'},
          on: {
            left: {field: 'parentUsername', table: 'parent'},
            operand: '=',
            right: {field: 'username', table: 'parent.parent'},
          },
        },
      ],
    };
    expect(sql).toEqual(expectedSql);
  });
});