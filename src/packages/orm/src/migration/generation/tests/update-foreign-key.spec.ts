import { createSchema } from '../../../schema';
import { generateRelationalMigrationSteps } from '../generate-relational-migration-steps';

describe('update-foreign-key', () => {
  it('should update foreign key', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            parentId: { type: 'string', required: false },
          },
          primaryKeys: ['id'],
          references: {
            parent: {
              keys: [{ field: 'parentId', foreignField: 'id' }],
              table: 'User',
              onDelete: null,
              onUpdate: null,
            },
          },
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', required: true },
            parentId: { type: 'string', required: false },
          },
          primaryKeys: ['id'],
          references: {
            parent: {
              keys: [{ field: 'parentId', foreignField: 'id' }],
              table: 'User',
              onDelete: 'cascade',
              onUpdate: null,
            },
          },
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'drop_table_foreign_key',
        table: 'User',
        name: 'parent',
      },
      {
        kind: 'add_table_foreign_key',
        table: 'User',
        name: 'parent',
        fieldNames: ['parentId'],
        foreignFieldNames: ['id'],
        foreignTable: 'User',
        required: false,
        onDelete: 'cascade',
      },
    ]);
  });
});
