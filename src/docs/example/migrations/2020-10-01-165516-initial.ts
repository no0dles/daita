import { MigrationDescription } from '../../../packages/orm/migration/migration-description';

export const InitialMigration: MigrationDescription = {
  id: 'initial',
  steps: [
    { kind: 'add_table', table: 'Ascent' },
    {
      kind: 'add_table_field',
      table: 'Ascent',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Ascent',
      fieldName: 'date',
      type: 'date',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Ascent',
      fieldName: 'mountainId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Ascent', fieldNames: ['id'] },
    { kind: 'add_table', table: 'AscentPerson' },
    {
      kind: 'add_table_field',
      table: 'AscentPerson',
      fieldName: 'ascentId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'AscentPerson',
      fieldName: 'personId',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'AscentPerson', fieldNames: ['ascentId', 'personId'] },
    { kind: 'add_table', table: 'Canton' },
    {
      kind: 'add_table_field',
      table: 'Canton',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Canton',
      fieldName: 'shortname',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Canton',
      fieldName: 'languages',
      type: 'string[]',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Canton', fieldNames: ['shortname'] },
    { kind: 'add_table', table: 'Mountain' },
    {
      kind: 'add_table_field',
      table: 'Mountain',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Mountain',
      fieldName: 'name',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Mountain',
      fieldName: 'cantonShortname',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Mountain',
      fieldName: 'elevation',
      type: 'number',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Mountain',
      fieldName: 'prominence',
      type: 'number',
      required: true,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Mountain', fieldNames: ['id'] },
    { kind: 'add_table', table: 'Person' },
    {
      kind: 'add_table_field',
      table: 'Person',
      fieldName: 'id',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Person',
      fieldName: 'firstName',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Person',
      fieldName: 'lastName',
      type: 'string',
      required: true,
      defaultValue: undefined,
    },
    {
      kind: 'add_table_field',
      table: 'Person',
      fieldName: 'birthday',
      type: 'date',
      required: false,
      defaultValue: undefined,
    },
    { kind: 'add_table_primary_key', table: 'Person', fieldNames: ['id'] },
    {
      kind: 'add_table_foreign_key',
      table: 'Ascent',
      name: 'mountain',
      fieldNames: ['mountainId'],
      foreignFieldNames: ['id'],
      foreignTable: 'Mountain',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'AscentPerson',
      name: 'ascent',
      fieldNames: ['ascentId'],
      foreignFieldNames: ['id'],
      foreignTable: 'Ascent',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'AscentPerson',
      name: 'person',
      fieldNames: ['personId'],
      foreignFieldNames: ['id'],
      foreignTable: 'Person',
      required: true,
    },
    {
      kind: 'add_table_foreign_key',
      table: 'Mountain',
      name: 'canton',
      fieldNames: ['cantonShortname'],
      foreignFieldNames: ['shortname'],
      foreignTable: 'Canton',
      required: true,
    },
  ],
};
