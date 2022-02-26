import { createSchema } from '../../../schema';
import { generateRelationalMigrationSteps } from '../generate-relational-migration-steps';

describe('update-foreign-key', () => {
  it('should update foreign key', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            parentId: { type: 'string', name: 'id', required: false },
          },
          primaryKeys: ['id'],
          name: 'User',
          references: {
            parent: {
              keys: [{ field: 'parentId', foreignField: 'id' }],
              name: 'parent',
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
            id: { type: 'string', name: 'id', required: true },
            parentId: { type: 'string', name: 'id', required: false },
          },
          primaryKeys: ['id'],
          name: 'User',
          references: {
            parent: {
              keys: [{ field: 'parentId', foreignField: 'id' }],
              name: 'parent',
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
        kind: 'update_table_foreign_key',
        table: 'User',
        name: 'parent',
        fieldNames: ['parentId'],
        foreignFieldNames: ['id'],
        foreignTable: 'User',
        required: true,
      },
    ]);
  });
});
