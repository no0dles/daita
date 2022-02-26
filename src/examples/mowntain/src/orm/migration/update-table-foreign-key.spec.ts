import { createSchema, generateRelationalMigrationSteps } from '@daita/orm';

describe('orm/migration/update-table-foreign-key', () => {
  const baseSchema = createSchema('test', {
    tables: {
      User: {
        fields: {
          id: { type: 'string', name: 'id', required: true },
          username: { type: 'string', name: 'username', required: true },
          parentId: { type: 'string', name: 'parentId', required: false },
        },
        primaryKeys: ['id'],
        name: 'User',
        schema: 'custom',
        references: {
          parent: {
            table: 'User',
            schema: 'custom',
            name: 'parent',
            keys: [{ field: 'parentId', foreignField: 'id' }],
            onDelete: 'set null',
            onUpdate: null,
          },
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
          parentUsername: { type: 'string', name: 'parentUsername', required: false },
        },
        primaryKeys: ['username'],
        name: 'User',
        schema: 'custom',
        references: {
          parent: {
            table: 'User',
            schema: 'custom',
            name: 'parent',
            keys: [{ field: 'parentUsername', foreignField: 'username' }],
            onDelete: 'set null',
            onUpdate: null,
          },
        },
      },
    },
  });
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

  it('should generate steps', () => {
    expect(steps).toEqual([
      {
        fieldName: 'parentUsername',
        kind: 'add_table_field',
        required: false,
        schema: 'custom',
        table: 'User',
        type: 'string',
      },
      {
        fieldName: 'parentId',
        kind: 'drop_table_field',
        schema: 'custom',
        table: 'User',
      },
      {
        kind: 'drop_table_foreign_key',
        schema: 'custom',
        table: 'User',
        name: 'parent',
      },
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
      {
        fieldNames: ['parentUsername'],
        foreignFieldNames: ['username'],
        foreignTable: 'parent',
        foreignTableSchema: 'custom',
        kind: 'add_table_foreign_key',
        name: 'parent',
        onDelete: 'set null',
        required: false,
        schema: 'custom',
        table: 'User',
      },
    ]);
  });

  it('should not generate steps if nothing changes', () => {
    expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
  });
});
