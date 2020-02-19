import { assert } from 'chai';
import {DocumentCollectionSchemaCollectionField} from '@daita/core';
import {parseModelSchema, parseSchemaTables} from './generation';
import {SourceCodeModelReferencePropertyType} from '@daita/core/dist/model/source-code-model-reference-property-type';
import {RelationalTableSchemaTableReferenceKey} from '@daita/core/dist/schema/relational-table-schema-table-reference-key';
import {parseSourceFile} from '../ast/utils';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';

function compareArray(actual: any[], expected: any[]) {
  assert.deepEqual(actual.sort(), expected.sort());
}

function expectTable(schema: DatabaseSchema, expectedTables: string[]) {
  compareArray(schema.tableNames, expectedTables);
}

function expectTableFields(
  schema: DatabaseSchema,
  tableName: string,
  expectedFieldNames: string[],
) {
  const table = schema.table(tableName);
  if (!table) {
    throw new Error(`table ${tableName} does not exist`);
  }

  compareArray(table.fieldNames, expectedFieldNames);
}

function expectTablePrimaryKeys(
  schema: DatabaseSchema,
  tableName: string,
  expectedPrimaryKeys: string[],
) {
  const table = schema.table(tableName);
  if (!table) {
    throw new Error(`table ${tableName} does not exist`);
  }

  compareArray(table.primaryKeys, expectedPrimaryKeys);
}

function expectTableForeignKeys(
  schema: DatabaseSchema,
  tableName: string,
  expectedForeignKeys: RelationalTableSchemaTableReferenceKey[],
) {
  const table = schema.table(tableName);
  if (!table) {
    throw new Error(`table ${tableName} does not exist`);
  }

  compareArray(table.foreignKeys, expectedForeignKeys);
}

function expectTableField(
  schema: DatabaseSchema,
  tableName: string,
  fieldName: string,
  expected: DocumentCollectionSchemaCollectionField,
) {
  const table = schema.table(tableName);
  if (!table) {
    throw new Error(`table ${tableName} does not exist`);
  }

  const field = table.field(fieldName);
  if (!field) {
    throw new Error(`field ${fieldName} on table ${tableName} does not exist`);
  }

  assert.equal(field.type, expected.type);
  assert.equal(field.name, expected.name);
  assert.equal(field.required, expected.required);
  assert.equal(field.defaultValue, expected.defaultValue);
}

describe('parse-migration', () => {
  it('should parse reference type', () => {
    const sourceFile = parseSourceFile(
      `${process.cwd()}/test/migration/schema/schema.ts`,
    );
    const tables = parseSchemaTables(sourceFile, 'schema');
    const userRole = tables.filter(t => t.name === 'UserRole')[0];
    const roleProperty = userRole.properties.filter(p => p.name === 'role')[0];
    assert.equal(
      roleProperty.type instanceof SourceCodeModelReferencePropertyType,
      true,
    );
  });

  it('should parse schema', () => {
    const sourceFile = parseSourceFile(
      `${process.cwd()}/test/migration/schema/schema.ts`,
    );
    const schema = parseModelSchema(sourceFile, 'schema');

    expectTable(schema, [
      'User',
      'Permission',
      'Role',
      'RolePermission',
      'UserRole',
    ]);

    expectTableFields(schema, 'User', [
      'username',
      'firstName',
      'lastName',
      'password',
      'email',
    ]);
    expectTableFields(schema, 'Role', ['name']);
    expectTableFields(schema, 'Permission', ['name']);
    expectTableFields(schema, 'RolePermission', ['permissionName', 'roleName']);
    expectTableFields(schema, 'UserRole', ['roleName', 'userUsername']);

    expectTableField(schema, 'User', 'username', {
      required: true,
      defaultValue: null,
      type: 'string',
      name: 'username',
    });
    expectTableField(schema, 'User', 'firstName', {
      required: false,
      defaultValue: null,
      type: 'string',
      name: 'firstName',
    });
    expectTableField(schema, 'User', 'lastName', {
      required: false,
      defaultValue: null,
      type: 'string',
      name: 'lastName',
    });
    expectTableField(schema, 'User', 'password', {
      required: true,
      defaultValue: null,
      type: 'string',
      name: 'password',
    });
    expectTableField(schema, 'User', 'email', {
      required: true,
      defaultValue: null,
      type: 'string',
      name: 'email',
    });

    expectTablePrimaryKeys(schema, 'User', ['username']);
    expectTablePrimaryKeys(schema, 'Role', ['name']);
    expectTablePrimaryKeys(schema, 'Permission', ['name']);
    expectTablePrimaryKeys(schema, 'RolePermission', [
      'roleName',
      'permissionName',
    ]);
    expectTablePrimaryKeys(schema, 'UserRole', ['roleName', 'userUsername']);

    expectTableForeignKeys(schema, 'User', []);
    expectTableForeignKeys(schema, 'Role', []);
    expectTableForeignKeys(schema, 'Permission', []);
    expectTableForeignKeys(schema, 'RolePermission', [
      {
        table: 'Role',
        name: 'role',
        keys: ['roleName'],
        foreignKeys: ['name'],
      },
      {
        table: 'Permission',
        name: 'permission',
        keys: ['permissionName'],
        foreignKeys: ['name'],
      },
    ]);
    expectTableForeignKeys(schema, 'UserRole', [
      {
        table: 'Role',
        name: 'role',
        keys: ['roleName'],
        foreignKeys: ['name'],
      },
      {
        table: 'User',
        name: 'user',
        keys: ['userUsername'],
        foreignKeys: ['username'],
      },
    ]);
  });
});
