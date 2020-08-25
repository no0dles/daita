import { AstContext } from '../../ast/ast-context';
import * as path from 'path';
import { parseRelationalSchema } from './parse-relational-schema';
import { all, allow, authorized, table, Rule } from '@daita/relational';
import { isNotNull } from '../../test/utils.test';
import { RelationalSchemaDescription } from '@daita/orm';
import 'jest-extended';

describe('parse-relational-schema', () => {
  const context = new AstContext();
  const sourceFile = context.get(path.join(__dirname, './parse-relational-schema.test.ts'));
  const schemaVariable = sourceFile!.block.variable('schema');
  const parsedSchema = parseRelationalSchema(schemaVariable!);

  it('should parse schema', () => {
    expect(schemaVariable).toBeDefined();
    expect(parsedSchema).toBeDefined();
  });

  it('should parse schema table names', () => {
    expect(parsedSchema.tables.map(t => t.name)).toIncludeAllMembers(['UserRole', 'Role', 'RolePermission', 'User', 'Permission']);
  });

  it('should parse view', () => {
    console.log(parsedSchema.views);
    expect(parsedSchema.views).toHaveLength(1);
  })


  it(`should parse rules`, () => {
    const actualRules = parsedSchema.rules.map(r => r.rule);
    expect(actualRules).toEqual([
      allow(authorized(), { select: all(), from: table('User') }),
    ]);
  });

  const baseFields: ExpectedTableField[] = [
    {
      required: true,
      type: 'date',
      defaultValue: undefined,
      name: 'createdDate',
    },
    {
      required: false,
      type: 'date',
      defaultValue: undefined,
      name: 'modifiedDate',
    },
  ];

  shouldHaveTable(parsedSchema, {
    name: 'User',
    foreignKeys: [],
    primaryKeys: ['id'],
    indices: { username: { columns: ['username'], unique: true } },
    fields: [
      {
        required: true,
        type: 'uuid',
        defaultValue: undefined,
        name: 'id',
      },
      {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'username',
      },
      {
        required: true,
        type: 'string',
        defaultValue: '1234',
        name: 'password',
      },
      {
        required: true,
        type: 'date',
        defaultValue: undefined,
        name: 'lastLogin',
      },
      {
        required: true,
        type: 'string',
        name: 'userType',
        defaultValue: 'local',
      },
      {
        required: true,
        type: 'number',
        name: 'userStatus',
        defaultValue: undefined,
      },
      {
        required: true,
        type: 'boolean',
        defaultValue: false,
        name: 'admin',
      },
      ...baseFields,
    ],
  });

  shouldHaveTable(parsedSchema, {
    name: 'Role',
    foreignKeys: [
      { name: 'parentRole', table: 'Role', keys: ['parentRoleName'], foreignKeys: ['name'], required: false },
    ],
    primaryKeys: ['name'],
    indices: { desc: { columns: ['description'], unique: false } },
    fields: [
      {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'name',
      },
      {
        required: false,
        type: 'string',
        defaultValue: null,
        name: 'description',
      },
      {
        required: false,
        type: 'string',
        defaultValue: undefined,
        name: 'parentRoleName',
      },
      ...baseFields,
    ],
  });

  shouldHaveTable(parsedSchema, {
    name: 'Permission',
    foreignKeys: [],
    primaryKeys: ['name'],
    fields: [
      {
        required: true,
        type: 'string',
        defaultValue: undefined,
        name: 'name',
      },
      ...baseFields,
    ],
  });

  shouldHaveTable(parsedSchema, {
    name: 'UserRole',
    foreignKeys: [
      { name: 'role', table: 'Role', keys: ['roleName'], foreignKeys: ['name'], required: true },
      { name: 'user', table: 'User', keys: ['userId'], foreignKeys: ['id'], required: true },
    ],
    primaryKeys: ['roleName', 'userId'],
    fields: [
      {
        required: true,
        defaultValue: undefined,
        name: 'userId',
        type: 'uuid',
      },
      {
        required: true,
        defaultValue: undefined,
        name: 'roleName',
        type: 'string',
      },
      ...baseFields,
    ],
  });

  shouldHaveTable(parsedSchema, {
    name: 'RolePermission',
    foreignKeys: [
      { name: 'role', table: 'Role', keys: ['roleName'], foreignKeys: ['name'], required: true },
      { name: 'permission', table: 'Permission', keys: ['permissionName'], foreignKeys: ['name'], required: true },
    ],
    primaryKeys: ['roleName', 'permissionName'],
    fields: [
      {
        required: true,
        defaultValue: undefined,
        name: 'permissionName',
        type: 'string',
      },
      {
        required: true,
        defaultValue: undefined,
        name: 'roleName',
        type: 'string',
      },
      ...baseFields,
    ],
  });
});

function shouldHaveTable(relationalSchema: RelationalSchemaDescription, options: ExpectedTable) {
  describe(`${options.name} table`, () => {
    const roleTable = relationalSchema.table(table(options.name));
    isNotNull(roleTable);

    it('should parse primary keys', () => {
      expect(roleTable.primaryKeys.map(k => k.name)).toIncludeAllMembers(options.primaryKeys);
    });

    if (options.indices) {
      for (const name of Object.keys(options.indices)) {
        const expectedIndex = options.indices[name];
        it(`should parse index ${name}`, () => {
          const index = roleTable.getIndex(name);
          expect(index).toBeDefined();
          expect(index).not.toBeNull();
          expect(index!.name).toEqual(name);
          expect(index!.unique).toEqual(expectedIndex.unique);
          expect(index!.fields.map(f => f.name)).toEqual(expectedIndex.columns);
        });
      }
    }

    for (const foreignKey of options.foreignKeys) {
      it(`should parse ${foreignKey.name} foreign key`, () => {
        const tableForeignKey = roleTable.reference(foreignKey.name);
        expect({
          name: tableForeignKey.name, required: tableForeignKey.required, table: tableForeignKey.table.name,
          keys: tableForeignKey.keys.map(k => k.field.name),
          foreignKeys: tableForeignKey.keys.map(k => k.foreignField.name),
        }).toEqual(foreignKey);
      });
    }

    for (const fieldOptions of options.fields) {
      it(`should parse ${fieldOptions.name} field`, () => {
        const field = roleTable.field(fieldOptions.name);
        isNotNull(field);
        expect(field.required).toEqual(fieldOptions.required);
        expect(field.defaultValue).toEqual(fieldOptions.defaultValue);
        expect(field.type).toEqual(fieldOptions.type);
        expect(field.name).toEqual(fieldOptions.name);
      });
    }

    it('should not contain more foreign keys', () => {
      expect(roleTable.references.map(ref => ref.name)).toEqual(options.foreignKeys.map(field => field.name));
    });

    it('should not contain more fields', () => {
      expect(roleTable.fields.map(f => f.name)).toIncludeAllMembers(options.fields.map(field => field.name));
    });
  });
}

interface ExpectedTable {
  name: string,
  primaryKeys: string[],
  indices?: { [key: string]: { columns: string[], unique: boolean } };
  foreignKeys: { name: string, table: string, keys: string[], foreignKeys: string[], required: boolean }[],
  fields: ExpectedTableField[],
}

interface ExpectedTableField {
  name: string,
  type: string,
  required: boolean,
  defaultValue: any
}
