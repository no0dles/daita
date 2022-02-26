import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/create-table', () => {
  const baseSchema = createSchema('test');
  const targetSchema = createSchema('test', {
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
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      { kind: 'add_table', table: 'User', schema: 'custom' },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'id',
        type: 'string',
        required: true,
        defaultValue: undefined,
        schema: 'custom',
      },
      { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'], schema: 'custom' },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
