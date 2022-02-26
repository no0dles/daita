import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/drop-view', () => {
  const baseSchema = createSchema('test', {
    views: {
      User: {
        name: 'User',
        key: 'User',
        schema: 'custom',
        query: {
          select: 1,
        },
      },
    },
  });
  const targetSchema = createSchema('test');
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        kind: 'drop_view',
        schema: 'custom',
        view: 'User',
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
