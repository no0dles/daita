import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/update-table-primary-key', () => {
  const baseSchema = createSchema('test', {
    tables: {
      User: {
        fields: {
          id: { type: 'string', name: 'id', required: true },
          username: { type: 'string', name: 'username', required: true },
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
        },
        primaryKeys: ['username'],
        name: 'User',
        schema: 'custom',
      },
    },
  });
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        kind: 'drop_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
      {
        fieldNames: ['username'],
        kind: 'add_table_primary_key',
        schema: 'custom',
        table: 'User',
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
