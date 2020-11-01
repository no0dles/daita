import { generateRelationalMigrationSteps } from './generate-relational-migration-steps';
import { RelationalTableSchemaTableFieldType } from '../../schema/relational-table-schema-table-field-type';
import { RelationalSchemaDescription } from '../../schema/description/relational-schema-description';
import { RelationalTableDescription } from '../../schema/description/relational-table-description';
import { RelationalTableFieldDescription } from '../../schema/description/relational-table-field-description';
import { RelationalTableReferenceKeyDescription } from '../../schema/description/relational-table-reference-key-description';
import { RelationalTableReferenceDescription } from '../../schema/description/relational-table-reference-description';
import { RelationalTableIndexDescription } from '../../schema/description/relational-table-index-description';
import { table } from '../../../relational/sql/function/table';

describe('get-migration-steps', () => {
  it('should add table', () => {
    const currentSchema = createSchema({});
    const newSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      { kind: 'add_table', table: 'User' },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'id',
        type: 'string',
        required: true,
        defaultValue: undefined,
      },
      { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'] },
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
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const newSchema = createSchema({});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([{ kind: 'drop_table', table: 'User' }]);
  });

  it('should add table field', () => {
    const currentSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        User: {
          fields: {
            id: { type: 'string', primaryKey: true },
            username: {
              type: 'string',
              required: false,
              defaultValue: 'admin',
            },
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

  it('should add foreign key', () => {
    const currentSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
        Role: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        User: {
          fields: {
            id: { type: 'string', primaryKey: true },
            roleId: { type: 'string', required: true },
          },
          references: {
            role: { table: 'Role', keys: ['roleId'], foreignKeys: ['id'] },
          },
        },
        Role: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        fieldName: 'roleId',
        kind: 'add_table_field',
        required: true,
        table: 'User',
        type: 'string',
      },
      {
        kind: 'add_table_foreign_key',
        table: 'User',
        foreignTable: 'Role',
        name: 'role',
        fieldNames: ['roleId'],
        foreignFieldNames: ['id'],
        required: true,
      },
    ]);
  });

  it('should remove table field', () => {
    const currentSchema = createSchema({
      tables: {
        User: {
          fields: {
            id: { type: 'string', primaryKey: true },
            username: {
              type: 'string',
              required: false,
              defaultValue: 'admin',
            },
          },
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'drop_table_field',
        table: 'User',
        fieldName: 'username',
      },
    ]);
  });

  it('should drop references first', () => {
    const currentSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
          references: {
            parent: { keys: ['id'], table: 'User', foreignKeys: ['id'] },
          },
        },
      },
    });
    const newSchema = createSchema({});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      { kind: 'drop_table_foreign_key', table: 'User', name: 'parent' },
      { kind: 'drop_table', table: 'User' },
    ]);
  });

  it('should add table index on existing table', () => {
    const currentSchema = createSchema({
      tables: {
        User: {
          fields: {
            id: { type: 'string', primaryKey: true },
          },
        },
      },
    });
    const newSchema = createSchema({
      tables: {
        User: {
          fields: { id: { type: 'string', primaryKey: true } },
          indices: { id: { unique: true, columns: ['id'] } },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'create_index',
        table: 'User',
        name: 'id',
        unique: true,
        fields: ['id'],
      },
    ]);
  });
});

interface ExpectedSchema {
  tables?: {
    [key: string]: {
      references?: {
        [key: string]: {
          table: string;
          keys: string[];
          foreignKeys: string[];
        };
      };
      fields: {
        [key: string]: {
          primaryKey?: boolean;
          required?: boolean;
          type: RelationalTableSchemaTableFieldType;
          defaultValue?: any;
        };
      };
      indices?: {
        [key: string]: {
          unique: boolean;
          columns: string[];
        };
      };
    };
  };
}

function createSchema(schema: ExpectedSchema) {
  const description = new RelationalSchemaDescription('test');
  if (schema.tables) {
    for (const tableKey of Object.keys(schema.tables)) {
      const expectedTable = schema.tables[tableKey];
      const tableDescription = new RelationalTableDescription(description, tableKey, tableKey);
      for (const fieldKey of Object.keys(expectedTable.fields)) {
        const field = schema.tables[tableKey].fields[fieldKey];
        const fieldDescription = new RelationalTableFieldDescription(
          tableDescription,
          fieldKey,
          fieldKey,
          field.type,
          field.required ?? true,
          field.defaultValue,
        );
        tableDescription.addField(fieldKey, fieldDescription);
        if (field.primaryKey) {
          tableDescription.addPrimaryKey(fieldDescription);
        }
      }
      description.addTable(table(tableKey), tableDescription);

      if (expectedTable.indices) {
        for (const name of Object.keys(expectedTable.indices)) {
          const expectedIndex = expectedTable.indices[name];
          tableDescription.addIndex(
            name,
            new RelationalTableIndexDescription(
              name,
              tableDescription,
              expectedIndex.columns.map((c) => tableDescription.field(c)),
              expectedIndex.unique,
            ),
          );
        }
      }
    }

    for (const tableKey of Object.keys(schema.tables)) {
      const tableDescription = schema.tables[tableKey];
      if (tableDescription.references) {
        const currentTable = description.table(table(tableKey));
        for (const key of Object.keys(tableDescription.references)) {
          const ref = tableDescription.references[key];
          const refTable = description.table(table(ref.table));
          const refKeys: RelationalTableReferenceKeyDescription[] = [];
          for (let i = 0; i < ref.keys.length; i++) {
            refKeys.push({
              foreignField: refTable.field(ref.foreignKeys[i]),
              field: currentTable.field(ref.keys[i]),
            });
          }
          currentTable.addReference(key, new RelationalTableReferenceDescription(key, refTable, refKeys));
        }
      }
    }
  }
  return description;
}
