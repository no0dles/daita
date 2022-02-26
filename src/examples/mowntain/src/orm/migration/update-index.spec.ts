import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/update-index', () => {
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
        indices: {
          username: { unique: false, name: 'username', fields: ['username'] },
        },
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
        primaryKeys: ['id'],
        name: 'User',
        schema: 'custom',
        indices: {
          username: { unique: true, name: 'username', fields: ['username'] },
        },
      },
    },
  });
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        kind: 'drop_index',
        name: 'username',
        schema: 'custom',
        table: 'User',
      },
      {
        fields: ['username'],
        kind: 'create_index',
        name: 'username',
        schema: 'custom',
        table: 'User',
        unique: true,
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
