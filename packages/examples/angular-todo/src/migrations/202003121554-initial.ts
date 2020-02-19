import {MigrationDescription} from '@daita/core';

export const InitialMigration: MigrationDescription = {
  id: 'initial',
  steps: [
    {kind: 'add_table', table: 'Todo'},
    {kind: 'add_table_field', table: 'Todo', fieldName: 'id', type: 'string', required: true},
    {kind: 'add_table_field', table: 'Todo', fieldName: 'name', type: 'string', required: true},
    {kind: 'add_table_field', table: 'Todo', fieldName: 'id', type: 'boolean', required: true},
    {kind: 'add_table_primary_key', table: 'Todo', fieldNames: ['id']},
  ],
};
