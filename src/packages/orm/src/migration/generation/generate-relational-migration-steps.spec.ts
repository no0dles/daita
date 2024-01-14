import { generateRelationalMigrationSteps, reorderSteps } from './generate-relational-migration-steps';
import { createSchema } from '../../schema/description/relational-schema-description';
import { MigrationStep } from '../migration-step';

describe('get-migration-steps', () => {
  it('should add table', () => {
    const currentSchema = createSchema('test');
    const newSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
          },
          primaryKeys: ['id'],
          name: 'User',
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      { kind: 'add_table', table: 'User' },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'id',
        type: 'string',
        required: true,
        defaultValue: undefined,
      },
      { kind: 'add_table_primary_key', table: 'User', fieldNames: ['id'] },
    ]);
  });

  it('should update table field if required changed', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            name: { type: 'number', name: 'seq', required: true },
          },
          primaryKeys: ['id'],
          name: 'User',
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          fields: {
            id: { type: 'string', name: 'id', required: true },
            name: { type: 'number', name: 'seq', required: false },
          },
          primaryKeys: ['id'],
          name: 'User',
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'update_table_field_required',
        table: 'User',
        name: 'seq',
        required: false,
      },
    ]);
  });

  it('should do nothing', () => {
    const currentSchema = createSchema('test', {});
    const newSchema = createSchema('test', {});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([]);
  });

  it('should drop table', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([{ kind: 'drop_table', table: 'User' }]);
  });

  it('should add table field', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: { id: { type: 'string', name: 'id', required: true } },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: {
            id: { type: 'string', required: true, name: 'id' },
            username: {
              name: 'username',
              type: 'string',
              required: false,
              defaultValue: 'admin',
            },
          },
          primaryKeys: ['id'],
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        type: 'string',
        required: false,
        defaultValue: 'admin',
      },
    ]);
  });

  it('should add foreign key', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          primaryKeys: ['id'],
        },
        Role: {
          name: 'Role',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: {
            id: { type: 'string', required: true, name: 'id' },
            roleId: { type: 'string', required: true, name: 'roleId' },
          },
          primaryKeys: ['id'],
          references: {
            role: {
              table: 'Role',
              keys: [{ field: 'roleId', foreignField: 'id' }],
              name: 'role',
              onDelete: null,
              onUpdate: null,
            },
          },
        },
        Role: {
          name: 'Role',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          primaryKeys: ['id'],
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        fieldName: 'roleId',
        kind: 'add_table_field',
        required: true,
        table: 'User',
        type: 'string',
      },
      {
        kind: 'add_table_foreign_key',
        table: 'User',
        foreignTable: 'Role',
        name: 'role',
        fieldNames: ['roleId'],
        foreignFieldNames: ['id'],
        required: true,
      },
    ]);
  });

  it('should remove table field', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: {
            id: { type: 'string', required: true, name: 'id' },
            username: {
              name: 'username',
              type: 'string',
              required: false,
              defaultValue: 'admin',
            },
          },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          fields: { id: { type: 'string', required: true, name: 'id' } },
          primaryKeys: ['id'],
          name: 'User',
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'drop_table_field',
        table: 'User',
        fieldName: 'username',
      },
    ]);
  });

  it('should drop references first', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          references: {
            parent: {
              keys: [{ field: 'parentId', foreignField: 'id' }],
              table: 'User',
              name: 'parent',
              onDelete: null,
              onUpdate: null,
            },
          },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {});
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([{ kind: 'drop_table', table: 'User' }]);
  });

  it('should add table index on existing table', () => {
    const currentSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: {
            id: { type: 'string', required: true, name: 'id' },
          },
          primaryKeys: ['id'],
        },
      },
    });
    const newSchema = createSchema('test', {
      tables: {
        User: {
          name: 'User',
          fields: { id: { type: 'string', required: true, name: 'id' } },
          indices: { id: { unique: true, fields: ['id'], name: 'id' } },
          primaryKeys: ['id'],
        },
      },
    });
    const steps = generateRelationalMigrationSteps(currentSchema, newSchema);
    expect(steps).toEqual([
      {
        kind: 'create_index',
        table: 'User',
        name: 'id',
        unique: true,
        fields: ['id'],
      },
    ]);
  });

  it('should reorder dependencies', () => {
    const steps: MigrationStep[] = [
      {
        kind: 'add_table',
        table: 'User',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'email',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'firstName',
        type: 'string',
        required: false,
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'lastName',
        type: 'string',
        required: false,
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'password',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_primary_key',
        table: 'User',
        fieldNames: ['username'],
      },
      {
        kind: 'add_table',
        table: 'UserRole',
      },
      {
        kind: 'add_table_field',
        table: 'UserRole',
        fieldName: 'roleName',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_field',
        table: 'UserRole',
        fieldName: 'userUsername',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_primary_key',
        table: 'UserRole',
        fieldNames: ['roleName', 'userUsername'],
      },
      {
        kind: 'add_table_foreign_key',
        table: 'UserRole',
        name: 'role',
        fieldNames: ['roleName'],
        foreignFieldNames: ['name'],
        foreignTable: 'Role',
        required: true,
      },
      {
        kind: 'add_table_foreign_key',
        table: 'UserRole',
        name: 'user',
        fieldNames: ['userUsername'],
        foreignFieldNames: ['username'],
        foreignTable: 'User',
        required: true,
      },
      {
        kind: 'add_table',
        table: 'Role',
      },
      {
        kind: 'add_table_field',
        table: 'Role',
        fieldName: 'name',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_primary_key',
        table: 'Role',
        fieldNames: ['name'],
      },
      {
        kind: 'add_table',
        table: 'Permission',
      },
      {
        kind: 'add_table_field',
        table: 'Permission',
        fieldName: 'name',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_primary_key',
        table: 'Permission',
        fieldNames: ['name'],
      },
      {
        kind: 'add_table',
        table: 'RolePermission',
      },
      {
        kind: 'add_table_field',
        table: 'RolePermission',
        fieldName: 'permissionName',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_field',
        table: 'RolePermission',
        fieldName: 'roleName',
        type: 'string',
        required: true,
      },
      {
        kind: 'add_table_primary_key',
        table: 'RolePermission',
        fieldNames: ['permissionName', 'roleName'],
      },
      {
        kind: 'add_table_foreign_key',
        table: 'RolePermission',
        name: 'role',
        fieldNames: ['roleName'],
        foreignFieldNames: ['name'],
        foreignTable: 'Role',
        required: true,
      },
      {
        kind: 'add_table_foreign_key',
        table: 'RolePermission',
        name: 'permission',
        fieldNames: ['permissionName'],
        foreignFieldNames: ['name'],
        foreignTable: 'Permission',
        required: true,
      },
    ];
    const orderedSteps = reorderSteps(steps);
  });
});
