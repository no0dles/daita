import {MigrationDescription} from '../migration';
import {RelationalTableReferenceKeyDescription} from './description/relational-table-reference-key-description';
import {RelationalTableFieldDescription} from './description/relational-table-field-description';
import {RelationalTableDescription} from './description/relational-table-description';
import {SchemaMapper} from './description/schema-mapper';
import {RelationalSchemaDescription} from './description/relational-schema-description';

export function getSchemaDescription(schemaMapper: SchemaMapper, paths: MigrationDescription[]): RelationalSchemaDescription {
  const schema = new RelationalSchemaDescription();

  for (const path of paths) {
    for (const step of path.steps) {
      if (step.kind === 'add_table') {
        const tableName = schemaMapper.add(step.table, path.id);
        schema.add(step.table, new RelationalTableDescription(tableName, step.schema));
      } else if (step.kind === 'add_table_field') {
        const fieldMapper = schemaMapper.field(step.table);
        const fieldName = fieldMapper.add(step.fieldName, path.id);
        const table = schema.table({table: step.table, schema: step.schema});
        table.addField(step.fieldName, new RelationalTableFieldDescription(step.fieldName, fieldName, step.type, step.required, step.defaultValue));
      } else if (step.kind === 'add_table_primary_key') {
        //TODO
      } else if (step.kind === 'add_table_foreign_key') {
        const table = schema.table({schema: step.schema, table: step.table});
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
        table.addReference(step.name, {
          table: foreignTable,
          name: step.name,
          keys,
        });
      } else if (step.kind === 'drop_table_field') {
        schemaMapper.field(step.table).drop(step.fieldName);
        schema.table({table: step.table, schema: step.schema}).removeField(step.fieldName);
      } else if (step.kind === 'add_table_permission') {
        //TODO
      } else if (step.kind === 'drop_table_permission') {
        //TODO
      } else if (step.kind === 'drop_table') {
        schemaMapper.drop(step.table);
        schema.remove(step.table, step.schema);
      } else if (step.kind === 'modify_collection_field' ||
        step.kind === 'rename_collection_field' ||
        step.kind === 'drop_collection_field' ||
        step.kind === 'add_collection_field' ||
        step.kind === 'drop_collection' ||
        step.kind === 'add_collection') {
        continue;
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }

  return schema;
}
