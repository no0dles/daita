import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/drop-table', () => {
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
  const targetSchema = createSchema('test');
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([{ kind: 'drop_table', table: 'User', schema: 'custom' }]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
