import { GenerateOptions } from './generate-options';
import {
  getIndicesFromSchemaTable,
  SchemaDescription,
  SchemaTableDescription,
  SchemaTableFieldDescription,
  SchemaTableIndexDescription,
  SchemaViewDescription,
} from '../../schema';
import { OrmSql } from '../sql';
import { CreateTableForeignKey, table } from '@daita/relational';
import { extendMergeResult } from './extend-merge-result';
import { merge, mergeArray } from '@daita/common';
import { generateDifference } from './generate-difference';

export function generateSql(currentSchema: SchemaDescription, newSchema: SchemaDescription) {
  const sqls: OrmSql[] = [];

  const mergedTables = merge(currentSchema.tables, newSchema.tables);
  const mergedViews = merge(currentSchema.views, newSchema.views);
  const mergedRules = merge(currentSchema.rules, newSchema.rules);

  sqls.push(...generateDifference(newSchema, mergedTables, tableOptions));
  sqls.push(...generateDifference(newSchema, mergedViews, viewOptions));
  //steps.push(...generateDifference(newSchema, mergedRules, ruleOptions));

  return sqls;
}

const tableFields: GenerateOptions<{ table: SchemaTableDescription; field: SchemaTableFieldDescription }, OrmSql> = {
  addFunction: (newSchema, value) => {
    return [
      {
        alterTable: table(value.table.name, value.table.schema),
        add: {
          column: value.field.name,
          type: value.field.type,
          defaultValue: value.field.defaultValue,
          notNull: value.field.required,
        },
      },
    ];
  },
  removeFunction: (schema, value) => {
    return [
      {
        alterTable: table(value.table.name, value.table.schema),
        drop: {
          column: value.field.name,
        },
      },
    ];
  },
  mergeFunction: (schema, current, next) => {
    if (current.field.type !== next.field.type) {
      return [...tableFields.removeFunction(schema, next), ...tableFields.addFunction(schema, next)];
    } else if (
      current.field.defaultValue !== next.field.defaultValue ||
      current.field.required !== next.field.required ||
      current.field.size !== next.field.size
    ) {
      // TODO
    }

    return [];
  },
};

const tableOptions: GenerateOptions<SchemaTableDescription, OrmSql> = {
  addFunction: (schema, value) => {
    return [
      {
        createTable: table(value.name, value.schema),
        columns: Object.keys(value.fields).map((fieldKey) => ({
          name: value.fields[fieldKey].name,
          type: value.fields[fieldKey].type,
          notNull: value.fields[fieldKey].required,
          defaultValue: value.fields[fieldKey].defaultValue,
          primaryKey: value.primaryKeys.indexOf(fieldKey) >= 0,
        })),
        foreignKey: Object.keys(value.references).reduce<{ [key: string]: CreateTableForeignKey }>(
          (foreignKeys, referenceKey) => {
            foreignKeys[referenceKey] = {
              key: value.references[referenceKey].keys.map((k) => k.field),
              references: {
                table: table(value.references[referenceKey].table, value.references[referenceKey].schema),
                primaryKey: value.references[referenceKey].keys.map((k) => k.foreignField),
              },
              onUpdate: value.references[referenceKey].onUpdate ?? undefined,
              onDelete: value.references[referenceKey].onDelete ?? undefined,
            };
            return foreignKeys;
          },
          {},
        ),
      },
      ...getIndicesFromSchemaTable(value).map((index) => ({
        createIndex: index.name,
        unique: index.unique,
        columns: index.fields,
        on: table(value.name, value.schema),
      })),
    ];
  },
  removeFunction: (schema, value) => {
    return [{ dropTable: table(value.name, value.schema) }];
  },
  mergeFunction: (schema, current, target) => {
    const mergedFields = extendMergeResult(merge(current.fields, target.fields), (field) => ({
      field,
      table: target,
    }));
    const mergedPrimaryKeys = mergeArray(current.primaryKeys, target.primaryKeys);
    const mergedReferences = extendMergeResult(merge(current.references, target.references), (foreignKey) => ({
      foreignKey,
      table: target,
    }));
    const mergedIndices = extendMergeResult(merge(current.indices, target.indices), (index) => ({
      index,
      table: target,
    }));
    const mergedSeeds = extendMergeResult(merge(current.seeds, target.seeds), (seed) => ({
      seed,
      table: target,
    }));

    return [];
  },
};

const viewOptions: GenerateOptions<SchemaViewDescription, OrmSql> = {
  addFunction: (schema, view) => {
    return [
      {
        createView: table(view.name, view.schema),
        as: view.query,
      },
    ];
  },
  removeFunction: (schema, view) => {
    return [{ dropView: table(view.name, view.schema) }];
  },
  mergeFunction: (schema, current, target) => {
    const currentSql = JSON.stringify(current.query);
    const targetSql = JSON.stringify(target.query);
    if (currentSql !== targetSql) {
      return [
        { dropView: table(target.name, target.schema) },
        {
          createView: table(target.name, target.schema),
          as: target.query,
        },
      ];
    }

    return [];
  },
};

export const indexOptions: GenerateOptions<
  { table: SchemaTableDescription; index: SchemaTableIndexDescription },
  OrmSql
> = {
  addFunction: (schema, value) => {
    return [
      {
        createIndex: value.index.name,
        unique: value.index.unique,
        columns: value.index.fields,
        on: table(value.table.name, value.table.schema),
      },
    ];
  },
  removeFunction: (schema, value) => {
    return [
      {
        dropIndex: value.index.name,
        on: table(value.table.name, value.table.schema),
      },
    ];
  },
  mergeFunction: (schema, current, target) => {
    const fields = mergeArray(current.index.fields, target.index.fields);

    if (current.index.unique !== target.index.unique || fields.hasChanges) {
      return [...indexOptions.removeFunction(schema, current), ...indexOptions.addFunction(schema, target)];
    }

    return [];
  },
};
