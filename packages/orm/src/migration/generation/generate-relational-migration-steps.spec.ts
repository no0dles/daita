import {generateRelationalMigrationSteps} from './generate-relational-migration-steps';
import {RelationalTableSchemaTableFieldType} from '../../schema/relational-table-schema-table-field-type';
import {RelationalSchemaDescription} from '../../schema/description/relational-schema-description';
import {RelationalTableDescription} from '../../schema/description/relational-table-description';
import {RelationalTableFieldDescription} from '../../schema/description/relational-table-field-description';
import {TablePermission} from '@daita/relational';

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
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'id',
        type: 'string',
        required: true,
        defaultValue: undefined,
      },
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
          permissions: [{role: 'admin', select: true}],
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {kind: 'add_table_permission', table: 'User', permission: {role: 'admin', select: true}},
    ]);
  });

  it('should drop permission', () => {
    const currentSchema = createSchema({
      tables: {
        'User': {
          fields: {id: {type: 'string', primaryKey: true}},
          permissions: [{role: 'admin', select: true}],
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
      {kind: 'drop_table_permission', table: 'User', permission: {role: 'admin', select: true}},
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
        fieldName: 'username',
      },
    ]);
  });
});

interface ExpectedSchema {
  tables?: { [key: string]: { fields: { [key: string]: { primaryKey?: boolean, required?: boolean, type: RelationalTableSchemaTableFieldType, defaultValue?: any } }, permissions?: TablePermission<any>[] } }
}

function createSchema(schema: ExpectedSchema) {
  const description = new RelationalSchemaDescription();
  if (schema.tables) {
    for (const tableKey of Object.keys(schema.tables)) {
      const table = schema.tables[tableKey];
      const tableDescription = new RelationalTableDescription(description, tableKey, tableKey);
      for (const fieldKey of Object.keys(table.fields)) {
        const field = schema.tables[tableKey].fields[fieldKey];
        const fieldDescription = new RelationalTableFieldDescription(tableDescription, fieldKey, fieldKey, field.type, field.required ?? true, field.defaultValue);
        tableDescription.addField(fieldKey, fieldDescription);
        if (field.required) {
          tableDescription.addPrimaryKey(fieldDescription);
        }
      }
      description.addTable(tableKey, tableDescription);
    }
  }
  return description;
}
