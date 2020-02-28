import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import {generateRelationalMigrationSteps} from './generate-relational-migration-steps';
import {DatabaseSchemaTable} from '@daita/core/dist/schema/database-schema-table';
import {Permission, RelationalTableSchemaTableField, RelationalTableSchemaTableFieldType} from '@daita/core';
import {RelationalTableSchemaTableReferenceKey} from '@daita/core/dist/schema/relational-table-schema-table-reference-key';

describe('get-migration-steps', () => {
  it('should add table', () => {
    const currentSchema = createSchema({});
    const newSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {kind: 'add_table', table: 'User'},
      {kind: 'add_table_field', table: 'User', fieldName: 'id', type: 'string', required: true, defaultValue: null},
      {kind: 'add_table_primary_key', table: 'User', fieldNames: ['id']},
    ]);
  });

  it('should do nothing', () => {
    const currentSchema = createSchema({});
    const newSchema = createSchema({});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([]);
  });

  it('should drop table', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const newSchema = createSchema({});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {kind: 'drop_table', table: 'User'},
    ]);
  });

  it('should add permission', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
          permissions: [{type: 'role', role: 'admin', select: true}],
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {kind: 'add_table_permission', table: 'User', permission: {role: 'admin', select: true, type: 'role'}},
    ]);
  });

  it('should drop permission', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
          permissions: [{type: 'role', role: 'admin', select: true}],
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {kind: 'drop_table_permission', table: 'User', permission: {role: 'admin', select: true, type: 'role'}},
    ]);
  });

  it('should add table field', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        'User': {
          fields: {
            id: {type: 'string', primaryKey: true},
            username: {type: 'string', required: false, defaultValue: 'admin'},
          },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        type: 'string',
        required: false,
        defaultValue: 'admin',
      },
    ]);
  });

  it('should remove table field', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {
            id: {type: 'string', primaryKey: true},
            username: {type: 'string', required: false, defaultValue: 'admin'},
          },
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'drop_table_field',
        table: 'User',
        fieldName: 'username'
      },
    ]);
  });
});

interface ExpectedSchema {
  tables?: { [key: string]: { fields: { [key: string]: { primaryKey?: boolean, required?: boolean, type: RelationalTableSchemaTableFieldType, defaultValue?: any } }, permissions?: Permission<any>[] } }
}

function createSchema(schema: ExpectedSchema) {
  const tableMap: { [key: string]: DatabaseSchemaTable } = {};
  const permissionMap: { [key: string]: Permission<any>[] } = {};
  if (schema.tables) {
    for (const tableKey of Object.keys(schema.tables)) {
      const table = schema.tables[tableKey];
      const fieldMap: { [key: string]: RelationalTableSchemaTableField } = {};
      const primaryKeys: string[] = [];
      const foreignKeys: RelationalTableSchemaTableReferenceKey[] = [];
      for (const fieldKey of Object.keys(table.fields)) {
        const field = schema.tables[tableKey].fields[fieldKey];
        fieldMap[fieldKey] = {
          name: fieldKey,
          type: field.type,
          defaultValue: field.defaultValue ?? null,
          required: field.required ?? true,
        };
        if (field.primaryKey) {
          primaryKeys.push(fieldKey);
        }
      }
      if (table.permissions) {
        if (!permissionMap[tableKey]) {
          permissionMap[tableKey] = [];
        }
        for (const permission of table.permissions) {
          permissionMap[tableKey].push(permission);
        }
      }
      tableMap[tableKey] = new DatabaseSchemaTable(tableKey, fieldMap, primaryKeys, foreignKeys);
    }
  }
  return new DatabaseSchema({}, tableMap, permissionMap);
}