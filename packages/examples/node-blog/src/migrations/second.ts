import {MigrationDescription} from '@daita/core';
import {blogAdminRole} from '../roles';

export const SecondMigration: MigrationDescription = {
  id: 'second',
  after: 'first',
  steps: [
    {kind: 'add_table_field', table: 'User', fieldName: 'admin', type: 'boolean', required: true},
    {kind: 'add_table', table: 'Comment'},
    {kind: 'add_table_primary_key', table: 'Comment', fieldNames: ['id']},
    {kind: 'add_table_field', table: 'Comment', fieldName: 'id', type: 'string', required: true},
    {kind: 'add_table_field', table: 'Comment', fieldName: 'text', type: 'string', required: true},
    {kind: 'add_table_field', table: 'Comment', fieldName: 'userId', type: 'string', required: true},
    {
      kind: 'add_table_foreign_key',
      table: 'Comment',
      name: 'user',
      fieldNames: ['userId'],
      foreignTable: 'User',
      foreignFieldNames: ['id'],
      required: true,
    },
    {kind: 'add_table_permission', table: 'Comment', permission: {role: blogAdminRole, select: true}},
  ],
};
