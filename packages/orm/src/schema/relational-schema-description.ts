import { MigrationDescription } from '../migration';
import { RelationalTableReferenceKeyDescription } from './description/relational-table-reference-key-description';
import { RelationalTableFieldDescription } from './description/relational-table-field-description';
import { RelationalTableDescription } from './description/relational-table-description';
import { SchemaMapper } from './description/schema-mapper';
import { RelationalSchemaDescription } from './description/relational-schema-description';
import { failNever } from '@daita/common';
import { RelationalTableReferenceDescription } from './description/relational-table-reference-description';
import { table } from '@daita/relational';
import { RelationalTableIndexDescription } from './description/relational-table-index-description';
import { RelationalViewDescription } from './description/relational-view-description';

export function getSchemaDescription(schemaMapper: SchemaMapper, paths: MigrationDescription[]): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  for (const path of paths) {
    for (const step of path.steps) {
      if (step.kind === 'add_table') {
        const tableName = schemaMapper.add(step.table, path.id);
        schema.addTable(table(step.table, step.schema), new RelationalTableDescription(schema, step.table, tableName, step.schema));
      } else if (step.kind === 'add_table_field') {
        const fieldMapper = schemaMapper.field(step.table);
        const fieldName = fieldMapper.add(step.fieldName, path.id);
        const table = schema.table({ table: step.table, schema: step.schema });
        table.addField(step.fieldName, new RelationalTableFieldDescription(table, step.fieldName, fieldName, step.type, step.required, step.defaultValue));
      } else if (step.kind === 'add_table_primary_key') {
        const table = schema.table({ table: step.table, schema: step.schema });
        for (const fieldName of step.fieldNames) {
          table.addPrimaryKey(table.field(fieldName));
        }
      } else if (step.kind === 'add_table_foreign_key') {
        const table = schema.table({ schema: step.schema, table: step.table });
        const foreignTable = schema.table({
          schema: step.foreignTableSchema,
          table: step.foreignTable,
        });
        const keys: RelationalTableReferenceKeyDescription[] = [];
        for (let i = 0; i < step.fieldNames.length; i++) {
          const field = table.field(step.fieldNames[i]);
          const foreignField = foreignTable.field(step.foreignFieldNames[i]);
          keys.push({
            foreignField,
            field,
          });
        }
        table.addReference(step.name, new RelationalTableReferenceDescription(step.name, foreignTable, keys));
      } else if (step.kind === 'drop_table_field') {
        schemaMapper.field(step.table).drop(step.fieldName);
        schema.table({ table: step.table, schema: step.schema }).removeField(step.fieldName);
      } else if (step.kind === 'drop_table') {
        schemaMapper.drop(step.table);
        schema.dropTable(table(step.table, step.schema));
      } else if (step.kind === 'create_index') {
        const tbl = schema.table(table(step.table, step.schema));
        const idx = new RelationalTableIndexDescription(step.name, tbl, step.fields.map(field => tbl.field(field)), step.unique ?? false);
        tbl.addIndex(step.name, idx);
      } else if (step.kind === 'drop_index') {
        schema.table(table(step.table, step.schema)).dropIndex(step.name);
      } else if (step.kind === 'drop_table_foreign_key') {
        const table = schema.table({ schema: step.schema, table: step.table });
        table.dropReference(step.name);
      } else if (step.kind === 'add_rule') {
        schema.addRule(step.rule);
      } else if (step.kind === 'drop_rule') {
        schema.dropRule(step.rule);
      } else if (step.kind === 'add_view') {
        const viewName = schemaMapper.add(step.view, path.id);
        schema.addView(table(step.view, step.schema), new RelationalViewDescription(schema, step.query, step.view, viewName, step.schema));
      } else if (step.kind === 'drop_view') {
        schemaMapper.drop(step.view);
        schema.dropView(table(step.view, step.schema));
      } else if (step.kind === 'alter_view') {
        const view = schema.view(table(step.view, step.schema));
        view.query = step.query;
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }

  return schema;
}
