import { table } from '@daita/relational';
import { buildSchema } from './build-schema';
import { emptySchema, SchemaTableFieldTypeDescription } from '../../schema';
import { OrmSql } from './orm-sql';
import { RelationalOrmAdapter } from '../../adapter';

describe('build-schema', () => {
  const testAdapter: RelationalOrmAdapter = {
    getDatabaseType(type: SchemaTableFieldTypeDescription, size: string | undefined): string {
      if (type === 'string') {
        if (size === undefined) {
          return 'VARCHAR';
        } else {
          return `VARCHAR(${size})`;
        }
      }
      throw new Error('unknown data type ' + type);
    },
  };

  it('should create table', () => {
    const sqls: OrmSql[] = [
      {
        createTable: table('User'),
        columns: [
          {
            name: 'id',
            type: 'VARCHAR',
            notNull: true,
          },
        ],
      },
    ];

    const schema = buildSchema(testAdapter, emptySchema('test'), sqls);
    expect(schema.tables['User'].name).toBe('User');
    expect(schema.tables['User'].fields['id'].name).toBe('id');
    expect(schema.tables['User'].fields['id'].type).toBe('string');
    expect(schema.tables['User'].fields['id'].required).toBeTruthy();
    expect(schema.tables['User'].fields['id'].defaultValue).toBeUndefined();
    expect(schema.tables['User'].fields['id'].size).toBeUndefined();
  });

  it('should drop table', () => {
    const sqls: OrmSql[] = [
      {
        createTable: table('User'),
        columns: [
          {
            name: 'id',
            type: 'VARCHAR',
            notNull: true,
          },
        ],
      },
      {
        dropTable: table('User'),
      },
    ];

    const schema = buildSchema(testAdapter, emptySchema('test'), sqls);
    expect(schema.tables['User']).toBeUndefined();
  });

  it('should alter table and add column', () => {
    const sqls: OrmSql[] = [
      {
        createTable: table('User'),
        columns: [
          {
            name: 'id',
            type: 'VARCHAR',
            notNull: true,
          },
        ],
      },
      {
        alterTable: table('User'),
        add: {
          column: 'name',
          type: 'VARCHAR(255)',
          notNull: true,
          defaultValue: 'Peter',
        },
      },
    ];

    const schema = buildSchema(testAdapter, emptySchema('test'), sqls);
    expect(schema.tables['User']).toBeDefined();
    expect(schema.tables['User'].fields['name']).toBeDefined();
    expect(schema.tables['User'].fields['name'].type).toBe('string');
    expect(schema.tables['User'].fields['name'].size).toBe(255);
    expect(schema.tables['User'].fields['name'].required).toBe(true);
    expect(schema.tables['User'].fields['name'].defaultValue).toBe('Peter');
  });

  it('should alter table and drop column', () => {
    const sqls: OrmSql[] = [
      {
        createTable: table('User'),
        columns: [
          {
            name: 'id',
            type: 'VARCHAR',
            notNull: true,
          },
          {
            name: 'name',
            type: 'VARCHAR(255)',
            notNull: true,
          },
        ],
      },
      {
        alterTable: table('User'),
        drop: {
          column: 'name',
        },
      },
    ];

    const schema = buildSchema(testAdapter, emptySchema('test'), sqls);
    expect(schema.tables['User']).toBeDefined();
    expect(schema.tables['User'].fields['name']).toBeUndefined();
  });
});
