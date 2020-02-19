import {MigrationDescription} from '../migration';

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
    },
  ],
};

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
    },
  ],
};
