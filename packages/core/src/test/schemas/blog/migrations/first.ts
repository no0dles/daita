import {MigrationDescription} from '../../../../migration';
import {blogAdminRole} from '../roles';

export const FirstMigration: MigrationDescription = {
  id: 'first',
  steps: [
    {kind: 'add_table', table: 'User'},
    {kind: 'add_table_primary_key', table: 'User', fieldNames: ['id']},
    {kind: 'add_table_field', table: 'User', fieldName: 'id', type: 'string', required: true},
    {kind: 'add_table_field', table: 'User', fieldName: 'name', type: 'string', required: true},
    {kind: 'add_table_field', table: 'User', fieldName: 'count', type: 'number', required: false},
    {kind: 'add_table_field', table: 'User', fieldName: 'parentId', type: 'string', required: false},
    {
      kind: 'add_table_foreign_key',
      table: 'User',
      name: 'parent',
      fieldNames: ['parentId'],
      foreignTable: 'User',
      foreignFieldNames: ['id'],
      required: true,
    },
    {kind: 'add_table_permission', table: 'User', permission: {role: blogAdminRole, type: 'role', select: true}},
    {kind: 'add_table_permission', table: 'Comment', permission: {role: blogAdminRole, type: 'role', select: true}}
  ],
};