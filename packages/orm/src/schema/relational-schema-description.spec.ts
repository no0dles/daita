import {getSchemaDescription} from './relational-schema-description';
import {SchemaMapper} from './description/schema-mapper';
import {BackwardCompatibleMapper} from './description/backward-compatible-mapper';
import {MigrationStep} from '../migration';

describe('relational-schema-description', () => {
  it('should get description', () => {
    const steps: MigrationStep[] = [
      {kind: 'add_table', table: 'User'},
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'username',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'firstName',
        required: false,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'lastName',
        required: false,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'password',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_field',
        table: 'User',
        fieldName: 'email',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_primary_key',
        table: 'User',
        fieldNames: ['username'],
      },
      {kind: 'add_table', table: 'UserRole'},
      {
        kind: 'add_table_field',
        table: 'UserRole',
        fieldName: 'roleName',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_field',
        table: 'UserRole',
        fieldName: 'userUsername',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_primary_key',
        table: 'UserRole',
        fieldNames: ['roleName', 'userUsername'],
      },
      {kind: 'add_table', table: 'Role'},
      {
        kind: 'add_table_field',
        table: 'Role',
        fieldName: 'name',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_primary_key',
        table: 'Role',
        fieldNames: ['name'],
      },
      {kind: 'add_table', table: 'Permission'},
      {
        kind: 'add_table_field',
        table: 'Permission',
        fieldName: 'name',
        required: true,
        defaultValue: null,
        type: 'string',
      },
      {
        kind: 'add_table_primary_key',
        table: 'Permission',
        fieldNames: ['name'],
      },
      {
        kind: 'add_table_foreign_key',
        table: 'UserRole',
        foreignTable: 'Role',
        name: 'role',
        fieldNames: ['roleName'],
        foreignFieldNames: ['roleName'],
        required: true,
      },
      {
        kind: 'add_table_foreign_key',
        table: 'UserRole',
        foreignTable: 'User',
        name: 'user',
        fieldNames: ['userUsername'],
        foreignFieldNames: ['userUsername'],
        required: true,
      },
    ];
    const schema = getSchemaDescription(new SchemaMapper(() => new BackwardCompatibleMapper()), [{steps, id: 'init'}]);
  });
});
