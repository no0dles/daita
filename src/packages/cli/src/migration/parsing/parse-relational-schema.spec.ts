import { AstContext } from '../../ast/ast-context';
import * as path from 'path';
import { parseRelationalSchema } from './parse-relational-schema';
import { allow } from '@daita/relational';
import { authorized } from '@daita/relational';
import {
  CreateSchemaTableDescription,
  createTableSchema,
  getFieldsFromSchemaTable,
  getIndicesFromSchemaTable,
  getReferencesFromSchemaTable,
  getRulesFromSchema,
  getTableFromSchema,
  getTablesFromSchema,
  SchemaDescription,
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

  shouldHaveTable(parsedSchema, 'User', {
    primaryKeys: ['id'],
    indices: { username: { fields: ['username'], unique: true } },
    fields: {
      id: {
        required: true,
        type: 'uuid',
        defaultValue: undefined,
      },
      username: {
        required: true,
        type: 'string',
        defaultValue: undefined,
      },
      password: {
        required: true,
        type: 'string',
        defaultValue: '1234',
        size: 64,
      },
      lastLogin: {
        required: true,
        type: 'date',
        defaultValue: undefined,
      },
      userType: {
        required: true,
        type: 'string',
        defaultValue: 'local',
      },
      userStatus: {
        required: true,
        type: 'number',
        defaultValue: undefined,
      },
      admin: {
        required: true,
        type: 'boolean',
        defaultValue: false,
      },
      extra: {
        required: true,
        type: 'json',
      },
      extraTyped: {
        required: true,
        type: 'json',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, 'Role', {
    references: {
      parentRole: {
        table: 'Role',
        keys: [{ field: 'parentRoleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
    },
    primaryKeys: ['name'],
    indices: { desc: { fields: ['description'], unique: false } },
    fields: {
      name: {
        required: true,
        type: 'string',
        defaultValue: undefined,
      },
      description: {
        required: false,
        type: 'string',
        defaultValue: null,
      },
      parentRoleName: {
        required: false,
        type: 'string',
        defaultValue: undefined,
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, 'Permission', {
    primaryKeys: ['name'],
    fields: {
      name: {
        required: true,
        type: 'string',
        defaultValue: undefined,
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, 'UserRole', {
    references: {
      role: {
        table: 'Role',
        keys: [{ field: 'roleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
      user: {
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
        type: 'uuid',
      },
      roleName: {
        required: true,
        defaultValue: undefined,
        type: 'string',
      },
      ...baseFields,
    },
  });

  shouldHaveTable(parsedSchema, 'RolePermission', {
    references: {
      role: {
        table: 'Role',
        keys: [{ field: 'roleName', foreignField: 'name' }],
        onUpdate: null,
        onDelete: null,
      },
      permission: {
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
        type: 'string',
      },
      roleName: {
        required: true,
        defaultValue: undefined,
        type: 'string',
      },
      ...baseFields,
    },
  });
});

function shouldHaveTable(
  relationalSchema: SchemaDescription,
  tableName: string,
  expected: CreateSchemaTableDescription,
) {
  describe(`${tableName} table`, () => {
    const roleTable = getTableFromSchema(relationalSchema, table(tableName));
    const expectedTableDescription = createTableSchema(tableName, expected);

    it('should parse primary keys', () => {
      expect(roleTable.table.primaryKeys).toEqual(expected.primaryKeys);
    });

    it('should parse indices', () => {
      expect(getIndicesFromSchemaTable(roleTable.table)).toEqual(getIndicesFromSchemaTable(expectedTableDescription));
    });
    it('should parse references', () => {
      expect(getReferencesFromSchemaTable(roleTable.table)).toEqual(
        getReferencesFromSchemaTable(expectedTableDescription),
      );
    });
    it('should parse fields', () => {
      expect(getFieldsFromSchemaTable(roleTable.table)).toEqual(getFieldsFromSchemaTable(expectedTableDescription));
    });
  });
}
