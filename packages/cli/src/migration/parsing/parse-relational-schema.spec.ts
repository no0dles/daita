import { MockAstContext } from '../../ast/ast-context';
import { parseRelationalSchema } from './parse-relational-schema';
import { isNotNull } from '../../test/utils.test';
import 'jest-extended';
import { all, allow, authorized, Rule, table } from '@daita/relational';
import { RelationalSchemaDescription } from '@daita/orm';

describe('parse-relational-schema', () => {
  const context = new MockAstContext();
  context.mock('schema.ts', `
      import {User, userRules} from './user';
      import {Role} from './role';
      import {Permission} from './permission';
      import {UserRole} from './user-role';
      import {RolePermission} from './role-permission';
      const schema = new RelationalSchema();
      schema.table(User, {indices: {username: {unique: true, columns: ['username']}}, rules: userRules});
      schema.table(Role, {key: 'name', indices: { desc: ['description']}});
      schema.table(Permission, {key: ['name']});
      schema.table(UserRole, {key: ['roleName', 'userId']});
      schema.table(RolePermission, {key: ['roleName', 'permissionName']});
    `);
  context.mock('base.ts', `
      export class BaseTable {
        createdDate: Date;
        modifiedDate?: Date;
      }
    `);
  context.mock('user.ts', `
      import {BaseTable} from './base';
      import {allow, authorized, all, table} from '@daita/relational';
      export class User extends BaseTable {
        id: string;
        username: string;
        password: string = '1234';
        lastLogin: Date;
        admin = false;
      }
      export const userRules = [
        allow(authorized(), {select: all(), from: table(User) }),
      ];
    `);
  context.mock('role.ts', `
      import {BaseTable} from './base';
      export class Role extends BaseTable {
        name: string;
        description: string | null;
        parentRole?: Role;
      }
    `);
  context.mock('permission.ts', `
      import {BaseTable} from './base';
      export class Permission extends BaseTable {
        name: string;
      }
    `);
  context.mock('user-role.ts', `
      import {BaseTable} from './base';
      import {Role} from './role';
      import {User} from './user';
      export class UserRole extends BaseTable {
        roleName: string;
        role: Role;
        userId: string;
        user: User;
      }
    `);
  context.mock('role-permission.ts', `
      import {BaseTable} from './base';
      import {Role} from './role';
      import {Permission} from './permission';
      export class RolePermission extends BaseTable {
        roleName: string;
        role: Role;
        permissionName: string;
        permission: Permission;
      }
    `);

  const schemaFile = context.get('schema.ts');
  isNotNull(schemaFile);

  const schemaVariable = schemaFile.getVariable('schema');
  isNotNull(schemaVariable);

  const relationalSchema = parseRelationalSchema(schemaVariable);

  it('should parse schema table names', () => {
    expect(relationalSchema.tables.map(t => t.name)).toIncludeAllMembers(['UserRole', 'Role', 'RolePermission', 'User', 'Permission']);
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

  shouldHaveTable(relationalSchema, {
    name: 'User',
    foreignKeys: [],
    primaryKeys: ['id'],
    indices: { username: { columns: ['username'], unique: true } },
    rules: [
      allow(authorized(), {select: all(), from: table('User') })
    ],
    fields: [
      {
        required: true,
        type: 'string',
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
        type: 'boolean',
        defaultValue: false,
        name: 'admin',
      },
      ...baseFields,
    ],
  });

  shouldHaveTable(relationalSchema, {
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
        defaultValue: undefined,
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

  shouldHaveTable(relationalSchema, {
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

  shouldHaveTable(relationalSchema, {
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

  shouldHaveTable(relationalSchema, {
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
          expect(index).not.toBeNull();
          if(index) {
            expect(index.name).toEqual(name);
            expect(index.unique).toEqual(expectedIndex.unique);
            expect(index.fields.map(f => f.name)).toEqual(expectedIndex.columns);
          }
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

    if (options.rules) {
      it(`should parse rules`, () => {
        const actualRules = roleTable.getRules();
        console.log(actualRules);
        // for (const rule of options.rules || []) {
        //
        // }
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
  rules?: Rule[];
}

interface ExpectedTableField {
  name: string,
  type: string,
  required: boolean,
  defaultValue: any
}
