import { ForeignKeyConstraint, TableDescription } from '@daita/relational';
import { Rule } from '@daita/relational';
import { SelectSql } from '@daita/relational';
import { SchemaTableFieldTypeDescription } from '../schema-table-field-type-description';
import { table } from '@daita/relational';
import { capitalize } from '@daita/common';

export function getTableDescriptionIdentifier(table: TableDescription<any>): string {
  if (table.schema) {
    return `${table.schema}.${table.table}`;
  }
  return table.table;
}

export interface SchemaDescription {
  name: string;
  tables?: { [key: string]: SchemaTableDescription };
  views?: { [key: string]: SchemaViewDescription };
  rules?: { [key: string]: SchemaRuleDescription };
}

export interface SchemaRuleDescription {
  id: string;
  rule: Rule;
}

export interface SchemaTableDescription {
  name: string;
  //key: string;
  schema?: string;
  primaryKeys?: string[];
  fields?: { [key: string]: SchemaTableFieldDescription };
  references?: { [key: string]: SchemaTableReferenceDescription };
  indices?: { [key: string]: SchemaTableIndexDescription };
  seeds?: { [key: string]: SchemaTableSeedDescription };
}

export interface CreateSchemaOptions {
  tables?: { [key: string]: SchemaTableDescription };
  views?: { [key: string]: SchemaViewDescription };
  rules?: { [key: string]: Rule };
}

export function createSchema(name: string, options?: CreateSchemaOptions): SchemaDescription {
  const tables = options?.tables ?? {};
  const rules = options?.rules ?? {};
  return {
    name,
    rules: Object.keys(rules).reduce<{ [key: string]: SchemaRuleDescription }>((map, id) => {
      map[id] = { id, rule: rules[id] };
      return map;
    }, {}),
    tables: Object.keys(tables).reduce<{ [key: string]: SchemaTableDescription }>((result, key) => {
      const tableKey = getTableDescriptionIdentifier({ table: key, schema: tables[key].schema });
      result[tableKey] = tables[key];
      return result;
    }, {}),
    views: options?.views ?? {},
  };
}

export function addTableReference(
  table: SchemaTableDescription,
  options: {
    name: string;
    referenceTableKey: string;
    referenceTable: SchemaTableDescription;
    required: boolean;
    onUpdate: ForeignKeyConstraint | null;
    onDelete: ForeignKeyConstraint | null;
  },
): void {
  const keys: SchemaTableReferenceKeyDescription[] = [];
  if (!options.referenceTable.primaryKeys || options.referenceTable.primaryKeys.length === 0) {
    throw new Error(`can not create foreign key without an primary key on ${options.referenceTableKey}`);
  }

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

  if (!table.references) {
    table.references = {};
  }

  table.references[options.name] = {
    keys,
    name: options.name,
    schema: options.referenceTable.schema,
    table: options.referenceTableKey,
    onDelete: options.onDelete,
    onUpdate: options.onUpdate,
  };
}

export function setTablePrimaryKey(table: SchemaTableDescription, keys: string[]): void {
  table.primaryKeys = keys;
}

export function containsTableField(table: SchemaTableDescription, key: string): boolean {
  return !!table.fields && !!table.fields[key];
}

function getKeyForSeed(key: string, table: SchemaTableDescription, seed: any): string {
  if (!table.primaryKeys || table.primaryKeys.length === 0) {
    throw new Error(`can not add seed without primary key on ${key}`);
  }
  return table.primaryKeys
    .map((primaryKey) => {
      return seed[primaryKey] ?? '';
    })
    .join('-');
}

export function updateSeed(
  tableKey: string,
  table: SchemaTableDescription,
  options: { keys: string[]; seed: any },
): void {
  if (!table.seeds) {
    table.seeds = {};
  }

  const seedKey = getKeyForSeed(tableKey, table, options.keys);
  table.seeds[seedKey] = {
    seedKeys: options.keys,
    seed: options.seed,
  };
}

export function removeSeed(tableKey: string, table: SchemaTableDescription, keys: string[]): void {
  if (table.seeds) {
    const key = getKeyForSeed(tableKey, table, keys);
    delete table.seeds[key];
  }
}

export function addExistingSeed(tableKey: string, table: SchemaTableDescription, seed: any, keys: any): void {
  if (!table.seeds) {
    table.seeds = {};
  }

  const key = getKeyForSeed(tableKey, table, keys);
  table.seeds[key] = {
    seed,
    seedKeys: keys,
  };
}

export function addSeed(tableKey: string, table: SchemaTableDescription, seed: any): void {
  if (!table.primaryKeys || table.primaryKeys.length === 0) {
    throw new Error(`can not add seed without primary key on ${tableKey}`);
  }

  const seedKeys: any = {};
  for (const primaryKey of table.primaryKeys) {
    seedKeys[primaryKey] = seed[primaryKey];
    delete seed[primaryKey];
  }

  addExistingSeed(tableKey, table, seed, seedKeys);
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
): void {
  if (!table.fields) {
    table.fields = {};
  }
  table.fields[field.key] = {
    //key: field.key,
    name: field.key,
    defaultValue: field.defaultValue,
    required: field.required,
    size: field.size,
    type: field.type,
  };
}

export function doDropTableField(table: SchemaTableDescription, key: string): void {
  if (table.fields) {
    delete table.fields[key];
  }
}

export interface SchemaTableSeedDescription {
  seed: any;
  seedKeys: any;
}

export interface SchemaTableFieldDescription {
  name: string;
  type: SchemaTableFieldTypeDescription;
  size?: number | undefined;
  required: boolean;
  defaultValue?: any;
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
  onUpdate: ForeignKeyConstraint | null;
  onDelete: ForeignKeyConstraint | null;
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
  if (!schema.tables) {
    return [];
  }
  const tables = schema.tables;
  return Object.keys(tables).map((key) => tables[key]);
}

export function getRulesFromSchema(schema: SchemaDescription): Rule[] {
  if (!schema.rules) {
    return [];
  }
  const rules = schema.rules;
  return Object.keys(rules).map((key) => rules[key].rule);
}

export function getFieldsFromSchemaTable(
  table: SchemaTableDescription,
): { field: SchemaTableFieldDescription; key: string }[];
export function getFieldsFromSchemaTable(
  table: SchemaTableDescription,
  keys: string[],
): { field: SchemaTableFieldDescription; key: string }[];
export function getFieldsFromSchemaTable(
  table: SchemaTableDescription,
  keys?: string[],
): { field: SchemaTableFieldDescription; key: string }[] {
  if (keys) {
    return keys.map((key) => ({ key, field: getFieldFromSchemaTable(table, key) }));
  } else {
    if (!table.fields) {
      return [];
    }
    const fields = table.fields;
    return Object.keys(fields)
      .sort()
      .map((key) => ({ key, field: fields[key] }));
  }
}

export function getFieldNamesFromSchemaTable(table: SchemaTableDescription): string[];
export function getFieldNamesFromSchemaTable(table: SchemaTableDescription, keys: string[]): string[];
export function getFieldNamesFromSchemaTable(table: SchemaTableDescription, keys?: string[]): string[] {
  if (keys) {
    return getFieldsFromSchemaTable(table, keys).map((k) => k.field.name);
  } else {
    return getFieldsFromSchemaTable(table).map((k) => k.field.name);
  }
}

export function getIndicesFromSchemaTable(table: SchemaTableDescription): SchemaTableIndexDescription[] {
  const indices = table.indices;
  if (!indices) {
    return [];
  }
  return Object.keys(indices).map((key) => indices[key]);
}
export function getSeedsFromSchemaTable(table: SchemaTableDescription): SchemaTableSeedDescription[] {
  const seeds = table.seeds;
  if (!seeds) {
    return [];
  }
  return Object.keys(seeds).map((key) => seeds[key]);
}
export function getReferencesFromSchemaTable(table: SchemaTableDescription): SchemaTableReferenceDescription[] {
  const references = table.references;
  if (!references) {
    return [];
  }
  return Object.keys(references).map((key) => references[key]);
}
export function getReferenceTableFromKey(schema: SchemaDescription, key: SchemaTableReferenceDescription) {
  return getTableFromSchema(schema, table(key.table, key.schema));
}

export function getIndexFromSchemaTable(table: SchemaTableDescription, key: string) {
  const fieldDescription = table.indices ? table.indices[key] : null;
  if (!fieldDescription) {
    throw new Error(`Unable to get index ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getReferenceFromSchemaTable(table: SchemaTableDescription, key: string) {
  const fieldDescription = table.references ? table.references[key] : null;
  if (!fieldDescription) {
    throw new Error(`Unable to get reference ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getFieldFromSchemaTable(table: SchemaTableDescription, key: string): SchemaTableFieldDescription {
  const fieldDescription = table.fields ? table.fields[key] : null;
  if (!fieldDescription) {
    throw new Error(`Unable to get field ${key} from table ${table.name}`);
  }
  return fieldDescription;
}

export function getTableFromSchema(
  schema: SchemaDescription,
  description: TableDescription<any>,
): { table: SchemaTableDescription; key: string } {
  const key = getTableDescriptionIdentifier(description);
  const table = schema.tables ? schema.tables[key] : null;
  if (!table) {
    throw new Error(`Unable to get table ${key} from schema`);
  }
  return { key, table };
}
export function getViewFromSchema(schema: SchemaDescription, key: TableDescription<any>): SchemaViewDescription {
  const identifier = getTableDescriptionIdentifier(key);
  const tableDescription = schema.views ? schema.views[identifier] : null;
  if (!tableDescription) {
    throw new Error(`Unable to get view ${identifier} from schema`);
  }
  return tableDescription;
}
export function containsTableInSchema(schema: SchemaDescription, key: TableDescription<any>) {
  const identifier = getTableDescriptionIdentifier(key);
  return schema.tables && !!schema.tables[identifier];
}

export function addTableToSchema(schema: SchemaDescription, table: { table: string; schema?: string }) {
  const tableDescription: SchemaTableDescription = {
    schema: table.schema,
    fields: {},
    references: {},
    primaryKeys: [],
    name: table.table,
    indices: {},
    seeds: {},
  };
  if (!schema.tables) {
    schema.tables = {};
  }
  const key = getTableDescriptionIdentifier(table);
  schema.tables[key] = tableDescription;
  return tableDescription;
}

export function addViewToSchema(schema: SchemaDescription, view: { query: any; schema?: string; name: string }): void {
  const identifier = getTableDescriptionIdentifier(table(view.name, view.schema));
  if (!schema.views) {
    schema.views = {};
  }
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
): void {
  if (!table.indices) {
    table.indices = {};
  }
  table.indices[index.key] = {
    name: index.key,
    fields: index.fields,
    unique: index.unique,
  };
}
export function dropTableIndex(table: SchemaTableDescription, key: string): void {
  if (table.indices) {
    delete table.indices[key];
  }
}

export function dropTableReference(table: SchemaTableDescription, key: string): void {
  if (table.references) {
    delete table.references[key];
  }
}

export function addRuleToSchema(schema: SchemaDescription, id: string, rule: Rule): void {
  if (schema.rules) {
    schema.rules[id] = { id, rule };
  }
}
export function dropRuleFromSchema(schema: SchemaDescription, id: string): void {
  if (schema.rules) {
    delete schema.rules[id];
  }
}
export function dropTableFromSchema(schema: SchemaDescription, key: TableDescription<any>): void {
  if (schema.tables) {
    delete schema.tables[getTableDescriptionIdentifier(key)];
  }
}
export function dropViewFromSchema(schema: SchemaDescription, key: TableDescription<any>): void {
  if (schema.views) {
    delete schema.views[getTableDescriptionIdentifier(key)];
  }
}
