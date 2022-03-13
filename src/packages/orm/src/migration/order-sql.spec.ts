import { CreateTableSql, table } from '@daita/relational';
import { orderSqls } from './order-sql';

describe('order-sqls', () => {
  it('should order create with foreign key', () => {
    const userTable = table('User');
    const roleTable = table('Role');

    const sqls: CreateTableSql[] = [
      {
        createTable: userTable,
        columns: [
          {
            name: 'id',
            primaryKey: true,
            type: 'uuid',
            notNull: true,
          },
          {
            name: 'roleId',
            primaryKey: true,
            type: 'uuid',
            notNull: true,
          },
        ],
        foreignKey: {
          role: {
            references: {
              table: roleTable,
              primaryKey: ['id'],
            },
            key: 'roleId',
          },
        },
      },
      {
        createTable: roleTable,
        columns: [
          {
            name: 'id',
            primaryKey: true,
            type: 'uuid',
            notNull: true,
          },
        ],
      },
    ];

    const orderedSqls = orderSqls(sqls);
    expect(orderedSqls[0].createTable).toEqual(roleTable);
    expect(orderedSqls[1].createTable).toEqual(userTable);
  });

  it('should order', () => {
    const sqls: CreateTableSql[] = [
      {
        createTable: {
          table: 'Ascent',
        },
        columns: [
          {
            name: 'id',
            type: 'uuid',
            primaryKey: true,
            notNull: false,
          },
          {
            name: 'date',
            type: 'date',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'mountainId',
            type: 'uuid',
            primaryKey: false,
            notNull: false,
          },
        ],
        foreignKey: {
          mountain: {
            references: {
              table: {
                table: 'Mountain',
              },
              primaryKey: ['id'],
            },
            key: ['mountainId'],
          },
        },
      },
      {
        createTable: {
          table: 'AscentPerson',
        },
        columns: [
          {
            name: 'ascentId',
            type: 'uuid',
            primaryKey: true,
            notNull: false,
          },
          {
            name: 'personId',
            type: 'uuid',
            primaryKey: true,
            notNull: false,
          },
        ],
        foreignKey: {
          ascent: {
            references: {
              table: {
                table: 'Ascent',
              },
              primaryKey: ['id'],
            },
            key: ['ascentId'],
          },
          person: {
            references: {
              table: {
                table: 'Person',
              },
              primaryKey: ['id'],
            },
            key: ['personId'],
          },
        },
      },
      {
        createTable: {
          table: 'Canton',
        },
        columns: [
          {
            name: 'name',
            type: 'string',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'shortname',
            type: 'string',
            size: 2,
            primaryKey: true,
            notNull: false,
          },
          {
            name: 'languages',
            type: 'string[]',
            primaryKey: false,
            notNull: false,
          },
        ],
        foreignKey: {},
      },
      {
        createTable: {
          table: 'Mountain',
        },
        columns: [
          {
            name: 'id',
            type: 'uuid',
            primaryKey: true,
            notNull: false,
          },
          {
            name: 'name',
            type: 'string',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'cantonShortname',
            type: 'string',
            size: 2,
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'elevation',
            type: 'number',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'prominence',
            type: 'number',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'ascents',
            type: 'number',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'extra',
            type: 'json',
            primaryKey: false,
            notNull: false,
          },
        ],
        foreignKey: {
          canton: {
            references: {
              table: {
                table: 'Canton',
              },
              primaryKey: ['shortname'],
            },
            key: ['cantonShortname'],
          },
        },
      },
      {
        createTable: {
          table: 'Person',
        },
        columns: [
          {
            name: 'id',
            type: 'uuid',
            primaryKey: true,
            notNull: false,
          },
          {
            name: 'firstName',
            type: 'string',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'lastName',
            type: 'string',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'birthday',
            type: 'date',
            primaryKey: false,
            notNull: false,
          },
          {
            name: 'active',
            type: 'boolean',
            primaryKey: false,
            notNull: false,
          },
        ],
        foreignKey: {},
      },
    ];

    const orderedSqls = orderSqls(sqls);
    expect(orderedSqls[0].createTable.table).toEqual('Canton');
    expect(orderedSqls[1].createTable.table).toEqual('Mountain');
    expect(orderedSqls[2].createTable.table).toEqual('Ascent');
    expect(orderedSqls[3].createTable.table).toEqual('Person');
    expect(orderedSqls[4].createTable.table).toEqual('AscentPerson');
  });
});
