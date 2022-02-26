import { AstContext } from '../../ast/ast-context';
import * as path from 'path';
import { parseRelationalSchema } from './parse-relational-schema';
import { allow } from '@daita/relational';
import { authorized } from '@daita/relational';
import {
  getFieldsFromSchemaTable,
  getIndicesFromSchemaTable,
  getReferencesFromSchemaTable,
  getRulesFromSchema,
  getTableFromSchema,
  getTablesFromSchema,
  SchemaDescription,
  SchemaTableDescription,
  SchemaTableFieldDescription,
} from '@daita/orm';
import { all } from '@daita/relational';
import { table } from '@daita/relational';
import { isDefined } from '@daita/common';

describe('parse-relational-schema', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './parse-relational-schema.test.ts'));
  isDefined(sourceFile);
  const schemaVariable = sourceFile.block.variable('schema');
  isDefined(schemaVariable);
  const parsedSchema = parseRelationalSchema(schemaVariable);

  it('should parse schema', () => {
    expect(schemaVariable).toBeDefined();
    expect(parsedSchema).toBeDefined();
  });

  it('should parse schema table names', () => {
    expect(getTablesFromSchema(parsedSchema).map((t) => t.name)).toEqual([
      'User',
      'Role',
      'Permission',
      'UserRole',
      'RolePermission',
    ]);
  });

  it('should parse view', () => {
    expect(Object.keys(parsedSchema.views || {})).toHaveLength(1);
  });

  it(`should parse rules`, () => {
    const actualRules = getRulesFromSchema(parsedSchema);
    expect(actualRules).toEqual([allow(authorized(), { select: all(), from: table('User') })]);
  });

  const baseFields: { [key: string]: SchemaTableFieldDescription } = {
    createdDate: {
      required: true,
      type: 'date',
      defaultValue: undefined,
      name: 'createdDate',
    },
    modifiedDate: {
      required: false,
      type: 'date',
      defaultValue: undefined,
      name: 'modifiedDate',
    },
  };

  shouldHaveTable(parsedSchema, {
    name: 'User',
    primaryKeys: ['id'],
    indices: { username: { fields: ['username'], unique: true, name: 'username' } },
    fields: {
      id: {
        required: true,
        type: 'uuid',
        defaultValue: undefined,
        name: 'id',
      },
      username: {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'username',
      },
      password: {
        required: true,
        type: 'string',
        defaultValue: '1234',
        name: 'password',
        size: 64,
      },
      lastLogin: {
        required: true,
        type: 'date',
        defaultValue: undefined,
        name: 'lastLogin',
      },
      userType: {
        required: true,
        type: 'string',
        name: 'userType',
        defaultValue: 'local',
      },
      userStatus: {
        required: true,
        type: 'number',
        name: 'userStatus',
        defaultValue: undefined,
      },
      admin: {
        required: true,
        type: 'boolean',
        defaultValue: false,
        name: 'admin',
      },
      extra: {
        required: true,
        type: 'json',
        name: 'extra',
      },
      extraTyped: {
        required: true,
        type: 'json',
        name: 'extraTyped',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, {
    name: 'Role',
    references: {
      parentRole: {
        name: 'parentRole',
        table: 'Role',
        keys: [{ field: 'parentRoleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
    },
    primaryKeys: ['name'],
    indices: { desc: { fields: ['description'], unique: false, name: 'desc' } },
    fields: {
      name: {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'name',
      },
      description: {
        required: false,
        type: 'string',
        defaultValue: null,
        name: 'description',
      },
      parentRoleName: {
        required: false,
        type: 'string',
        defaultValue: undefined,
        name: 'parentRoleName',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, {
    name: 'Permission',
    primaryKeys: ['name'],
    fields: {
      name: {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'name',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, {
    name: 'UserRole',
    references: {
      role: {
        name: 'role',
        table: 'Role',
        keys: [{ field: 'roleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
      user: {
        name: 'user',
        table: 'User',
        keys: [{ field: 'userId', foreignField: 'id' }],
        onUpdate: null,
        onDelete: null,
      },
    },
    primaryKeys: ['roleName', 'userId'],
    fields: {
      userId: {
        required: true,
        defaultValue: undefined,
        name: 'userId',
        type: 'uuid',
      },
      roleName: {
        required: true,
        defaultValue: undefined,
        name: 'roleName',
        type: 'string',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, {
    name: 'RolePermission',
    references: {
      role: {
        name: 'role',
        table: 'Role',
        keys: [{ field: 'roleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
      permission: {
        name: 'permission',
        table: 'Permission',
        keys: [{ field: 'permissionName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
    },
    primaryKeys: ['roleName', 'permissionName'],
    fields: {
      permissionName: {
        required: true,
        defaultValue: undefined,
        name: 'permissionName',
        type: 'string',
      },
      roleName: {
        required: true,
        defaultValue: undefined,
        name: 'roleName',
        type: 'string',
      },
      ...baseFields,
    },
  });
});

function shouldHaveTable(relationalSchema: SchemaDescription, expected: SchemaTableDescription) {
  describe(`${expected.name} table`, () => {
    const roleTable = getTableFromSchema(relationalSchema, table(expected.name));

    it('should parse primary keys', () => {
      expect(roleTable.table.primaryKeys).toEqual(expected.primaryKeys);
    });

    it('should parse indices', () => {
      expect(getIndicesFromSchemaTable(roleTable.table)).toEqual(getIndicesFromSchemaTable(expected));
    });
    it('should parse references', () => {
      expect(getReferencesFromSchemaTable(roleTable.table)).toEqual(getReferencesFromSchemaTable(expected));
    });
    it('should parse fields', () => {
      expect(getFieldsFromSchemaTable(roleTable.table)).toEqual(getFieldsFromSchemaTable(expected));
    });
  });
}
