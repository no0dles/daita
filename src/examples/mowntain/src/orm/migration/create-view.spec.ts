import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/create-view', () => {
  const baseSchema = createSchema('test');
  const targetSchema = createSchema('test', {
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
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        kind: 'add_view',
        query: {
          select: 1,
        },
        schema: 'custom',
        view: 'User',
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
