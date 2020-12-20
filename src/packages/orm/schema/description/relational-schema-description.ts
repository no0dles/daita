import { TableDescription } from '../../../relational/sql/keyword/table/table-description';
import { Rule } from '../../../relational/permission/description/rule';
import { SelectSql } from '../../../relational/sql/dml/select/select-sql';
import { SchemaTableFieldTypeDescription } from '../schema-table-field-type-description';
import { table } from '../../../relational';
import { capitalize } from '../../../cli/migration/utils';

export function getTableDescriptionIdentifier(table: TableDescription<any>): string {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

export interface SchemaDescription {
  name: string;
  tables: { [key: string]: SchemaTableDescription };
  views: { [key: string]: SchemaViewDescription };
  rules: { [key: string]: Rule }; // TODO create RuleDescription
}

export interface SchemaTableDescription {
  key: string;
  name: string;
  schema?: string;
  primaryKeys: string[];
  fields: { [key: string]: SchemaTableFieldDescription };
  references: { [key: string]: SchemaTableReferenceDescription };
  indices: { [key: string]: SchemaTableIndexDescription };
  seeds: { [key: string]: SchemaTableSeedDescription };
}

export function addTableReference(
  table: SchemaTableDescription,
  options: { name: string; referenceTable: SchemaTableDescription; required: boolean },
) {
  const keys: SchemaTableReferenceKeyDescription[] = [];
  for (const primaryKey of options.referenceTable.primaryKeys) {
    const key = `${options.name}${capitalize(primaryKey)}`;
    const foreignField = getFieldFromSchemaTable(options.referenceTable, primaryKey);

    if (!containsTableField(table, key)) {
      addTableField(table, {
        key,
        type: foreignField.type,
        size: foreignField.size,
        required: options.required,
        defaultValue: undefined,
      });
    } else {
      const field = getFieldFromSchemaTable(table, key);
      if (field.type !== foreignField.type) {
        throw new Error(`property ${key} type ${field.type} is not as foreign key type ${foreignField.type}`);
      }
    }

    keys.push({ field: key, foreignField: primaryKey });
  }

  table.references[name] = {
    keys,
    name: options.name,
    schema: options.referenceTable.schema,
    table: options.referenceTable.key,
  };
}

export function addTablePrimaryKeys(table: SchemaTableDescription, keys: string[]) {
  table.primaryKeys.push(...keys);
}
export function setTablePrimaryKey(table: SchemaTableDescription, keys: string[]) {
  table.primaryKeys = keys;
}

export function containsTableField(table: SchemaTableDescription, key: string) {
  return !!table.fields[key];
}

function getKeyForSeed(table: SchemaTableDescription, seed: any) {
  return table.primaryKeys
    .map((primaryKey) => {
      return seed[primaryKey] ?? '';
    })
    .join('-');
}

export function updateSeed(table: SchemaTableDescription, options: { keys: string[]; seed: any }) {
  const key = getKeyForSeed(table, options.keys);
  table.seeds[key] = {
    seedKeys: options.keys,
    seed: options.seed,
    key,
  };
}

export function removeSeed(table: SchemaTableDescription, keys: string[]) {
  const key = getKeyForSeed(table, keys);
  delete table.seeds[key];
}

export function addSeed(table: SchemaTableDescription, seed: any) {
  const seedKeys: any = {};
  for (const primaryKey of table.primaryKeys) {
    seedKeys[primaryKey] = seed[primaryKey];
    delete seed[primaryKey];
  }

  const key = getKeyForSeed(table, seedKeys);
  table.seeds[key] = {
    key,
    seed,
    seedKeys,
  };
}

export function addTableField(
  table: SchemaTableDescription,
  field: {
    key: string;
    type: SchemaTableFieldTypeDescription;
    size: number | undefined;
    required: boolean;
    defaultValue: any;
  },
) {
  table.fields[field.key] = {
    key: field.key,
    name: field.key,
    defaultValue: field.defaultValue,
    required: field.required,
    size: field.size,
    type: field.type,
  };
}

export function dropTableField(table: SchemaTableDescription, key: string) {
  delete table.fields[key];
}

export interface SchemaTableSeedDescription {
  key: string;
  seed: any;
  seedKeys: any;
}

export interface SchemaTableFieldDescription {
  key: string;
  name: string;
  type: SchemaTableFieldTypeDescription;
  size: number | undefined;
  required: boolean;
  defaultValue: any;
}

export interface SchemaTableIndexDescription {
  name: string;
  fields: string[];
  unique: boolean;
}

export interface SchemaTableReferenceDescription {
  name: string;
  table: string;
  schema?: string;
  keys: SchemaTableReferenceKeyDescription[];
}

export interface SchemaTableReferenceKeyDescription {
  foreignField: string;
  field: string;
}

export interface SchemaViewDescription {
  query: SelectSql<any>;
  key: string;
  name: string;
  schema?: string;
}

export function getTablesFromSchema(schema: SchemaDescription): SchemaTableDescription[] {
  return Object.keys(schema).map((key) => schema.tables[key]);
}

export function getRulesFromSchema(schema: SchemaDescription): Rule[] {
  return Object.keys(schema).map((key) => schema.rules[key]);
}

export function getFieldsFromSchemaTable(table: SchemaTableDescription): SchemaTableFieldDescription[];
export function getFieldsFromSchemaTable(table: SchemaTableDescription, keys: string[]): SchemaTableFieldDescription[];
export function getFieldsFromSchemaTable(
  table: SchemaTableDescription,
  keys?: string[],
): SchemaTableFieldDescription[] {
  if (keys) {
    return keys.map((key) => getFieldFromSchemaTable(table, key));
  } else {
    return Object.keys(table.fields).map((key) => table.fields[key]);
  }
}

export function getFieldNamesFromSchemaTable(table: SchemaTableDescription): string[];
export function getFieldNamesFromSchemaTable(table: SchemaTableDescription, keys: string[]): string[];
export function getFieldNamesFromSchemaTable(table: SchemaTableDescription, keys?: string[]): string[] {
  if (keys) {
    return getFieldsFromSchemaTable(table, keys).map((k) => k.name);
  } else {
    return getFieldsFromSchemaTable(table).map((k) => k.name);
  }
}

export function getIndicesFromSchemaTable(table: SchemaTableDescription): SchemaTableIndexDescription[] {
  return Object.keys(table.indices).map((key) => table.indices[key]);
}
export function getSeedsFromSchemaTable(table: SchemaTableDescription): SchemaTableSeedDescription[] {
  return Object.keys(table.indices).map((key) => table.seeds[key]);
}
export function getReferencesFromSchemaTable(table: SchemaTableDescription): SchemaTableReferenceDescription[] {
  return Object.keys(table.references).map((key) => table.references[key]);
}
export function getReferenceTableFromKey(schema: SchemaDescription, key: SchemaTableReferenceDescription) {
  return getTableFromSchema(schema, table(key.table, key.schema));
}

export function getIndexFromSchemaTable(table: SchemaTableDescription, key: string) {
  const fieldDescription = table.indices[key];
  if (!fieldDescription) {
    throw new Error(`Unable to get index ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getReferenceFromSchemaTable(table: SchemaTableDescription, key: string) {
  const fieldDescription = table.references[key];
  if (!fieldDescription) {
    throw new Error(`Unable to get reference ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getFieldFromSchemaTable(table: SchemaTableDescription, key: string): SchemaTableFieldDescription {
  const fieldDescription = table.fields[key];
  if (!fieldDescription) {
    throw new Error(`Unable to get field ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getTableFromSchema(schema: SchemaDescription, key: TableDescription<any>): SchemaTableDescription {
  const identifier = getTableDescriptionIdentifier(key);
  const tableDescription = schema.tables[identifier];
  if (!tableDescription) {
    throw new Error(`Unable to get table ${identifier} from schema`);
  }
  return tableDescription;
}
export function getViewFromSchema(schema: SchemaDescription, key: TableDescription<any>): SchemaViewDescription {
  const identifier = getTableDescriptionIdentifier(key);
  const tableDescription = schema.views[identifier];
  if (!tableDescription) {
    throw new Error(`Unable to get view ${identifier} from schema`);
  }
  return tableDescription;
}
export function containsTableInSchema(schema: SchemaDescription, key: TableDescription<any>) {
  const identifier = getTableDescriptionIdentifier(key);
  return !!schema.tables[identifier];
}

export function addTableToSchema(schema: SchemaDescription, table: { table: string; schema?: string }) {
  const tableDescription: SchemaTableDescription = {
    key: table.table,
    schema: table.schema,
    fields: {},
    references: {},
    primaryKeys: [],
    name: table.table,
    indices: {},
    seeds: {},
  };
  schema.tables[table.table] = tableDescription;
  return tableDescription;
}

export function addViewToSchema(schema: SchemaDescription, view: { query: any; schema?: string; name: string }) {
  const identifier = getTableDescriptionIdentifier(table(view.name, view.schema));
  schema.views[identifier] = {
    query: view.query,
    schema: view.schema,
    name: view.name,
    key: view.name,
  };
}

export function addIndexToTable(
  table: SchemaTableDescription,
  index: { key: string; fields: string[]; unique: boolean },
) {
  table.indices[index.key] = {
    name: index.key,
    fields: index.fields,
    unique: index.unique,
  };
}
export function dropTableIndex(table: SchemaTableDescription, key: string) {
  delete table.indices[key];
}

export function dropTableReference(table: SchemaTableDescription, key: string) {
  delete table.references[key];
}

export function addRuleToSchema(schema: SchemaDescription, id: string, rule: Rule) {
  schema.rules[id] = rule;
}
export function dropRuleFromSchema(schema: SchemaDescription, id: string) {
  delete schema.rules[id];
}
export function dropTableFromSchema(schema: SchemaDescription, key: TableDescription<any>) {
  delete schema.tables[getTableDescriptionIdentifier(key)];
}
export function dropViewFromSchema(schema: SchemaDescription, key: TableDescription<any>) {
  delete schema.views[getTableDescriptionIdentifier(key)];
}
