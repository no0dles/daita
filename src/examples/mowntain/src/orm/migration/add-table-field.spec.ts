import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/add-table-field', () => {
  const baseSchema = createSchema('test', {
    tables: {
      User: {
        fields: {
          id: { type: 'string', name: 'id', required: true },
        },
        primaryKeys: ['id'],
        name: 'User',
        schema: 'custom',
      },
    },
  });
  const targetSchema = createSchema('test', {
    tables: {
      User: {
        fields: {
          id: { type: 'string', name: 'id', required: true },
          username: { type: 'string', name: 'username', required: true },
          lastLogin: { type: 'date', name: 'lastLogin', required: false },
          enabled: { type: 'boolean', name: 'enabled', required: true, defaultValue: true },
        },
        primaryKeys: ['id'],
        name: 'User',
        schema: 'custom',
      },
    },
  });
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        type: 'string',
        required: true,
        defaultValue: undefined,
        schema: 'custom',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'lastLogin',
        type: 'date',
        required: false,
        defaultValue: undefined,
        schema: 'custom',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'enabled',
        type: 'boolean',
        required: true,
        defaultValue: true,
        schema: 'custom',
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
