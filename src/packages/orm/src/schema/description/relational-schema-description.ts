import { ForeignKeyConstraint, TableDescription } from '@daita/relational';
import { Rule } from '@daita/relational';
import { SelectSql } from '@daita/relational';
import { SchemaTableFieldTypeDescription } from '../schema-table-field-type-description';
import { table } from '@daita/relational';
import { capitalize, deepClone } from '@daita/common';

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
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  foreignTableAlias: TableDescription<any>,
  options: {
    name: string;
    required: boolean;
    onUpdate: ForeignKeyConstraint | null;
    onDelete: ForeignKeyConstraint | null;
  },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    const foreignTable = getTableFromSchema(newSchema, foreignTableAlias);

    const keys: SchemaTableReferenceKeyDescription[] = [];
    if (!foreignTable.table.primaryKeys || foreignTable.table.primaryKeys.length === 0) {
      throw new Error(`can not create foreign key without an primary key on ${foreignTable.key}`);
    }

    for (const primaryKey of foreignTable.table.primaryKeys) {
      const key = `${options.name}${capitalize(primaryKey)}`;
      const foreignField = getFieldFromSchemaTable(foreignTable.table, primaryKey);

      if (!containsTableField(table, key)) {
        if (!table.fields) {
          table.fields = {};
        }
        table.fields[key] = {
          //key: field.key,
          name: key,
          defaultValue: undefined,
          required: options.required,
          size: foreignField.size,
          type: foreignField.type,
        };
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
      schema: foreignTable.table.schema,
      table: foreignTable.table.name,
      onDelete: options.onDelete,
      onUpdate: options.onUpdate,
    };
  });
}

export function setTablePrimaryKey(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  keys: string[],
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    table.primaryKeys = keys;
  });
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
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  options: { keys: string[]; seed: any },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table, key } = getTableFromSchema(newSchema, tableAlias);
    if (!table.seeds) {
      table.seeds = {};
    }

    const seedKey = getKeyForSeed(key, table, options.keys);
    table.seeds[seedKey] = {
      seedKeys: options.keys,
      seed: options.seed,
    };
  });
}

export function removeSeed(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  keys: string[],
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table, key } = getTableFromSchema(newSchema, tableAlias);
    if (table.seeds) {
      const seedKey = getKeyForSeed(key, table, keys);
      delete table.seeds[seedKey];
    }
  });
}

export function addExistingSeed(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  seed: any,
  keys: any,
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { key, table } = getTableFromSchema(newSchema, tableAlias);
    if (!table.seeds) {
      table.seeds = {};
    }

    const seedKey = getKeyForSeed(key, table, keys);
    table.seeds[seedKey] = {
      seed,
      seedKeys: keys,
    };
  });
}

export function addSeed(schema: SchemaDescription, tableAlias: TableDescription<any>, seed: any): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    if (!table.primaryKeys || table.primaryKeys.length === 0) {
      throw new Error(`can not add seed without primary key on ${table.name}`);
    }

    const seedKeys: any = {};
    for (const primaryKey of table.primaryKeys) {
      seedKeys[primaryKey] = seed[primaryKey];
      delete seed[primaryKey];
    }

    if (!table.seeds) {
      table.seeds = {};
    }

    const seedKey = getKeyForSeed(table.name, table, seedKeys);
    table.seeds[seedKey] = {
      seed,
      seedKeys: seedKeys,
    };
  });
}

export function addTableField(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  field: {
    key: string;
    type: SchemaTableFieldTypeDescription;
    size: number | undefined;
    required: boolean;
    defaultValue: any;
  },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
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
  });
}

export function doDropTableField(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  key: string,
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    if (table.fields) {
      delete table.fields[key];
    }
  });
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

export function extendSchema(schema: SchemaDescription, fn: (schema: SchemaDescription) => void): SchemaDescription {
  const newSchema = deepClone(schema);
  fn(newSchema);
  return newSchema;
}

export function addTableToSchema(
  schema: SchemaDescription,
  table: { table: string; schema?: string },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const tableDescription: SchemaTableDescription = {
      schema: table.schema,
      fields: {},
      references: {},
      primaryKeys: [],
      name: table.table,
      indices: {},
      seeds: {},
    };
    if (!newSchema.tables) {
      newSchema.tables = {};
    }
    const key = getTableDescriptionIdentifier(table);
    newSchema.tables[key] = tableDescription;
  });
}

export function addViewToSchema(
  schema: SchemaDescription,
  view: { query: any; schema?: string; name: string },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const identifier = getTableDescriptionIdentifier(table(view.name, view.schema));
    if (!newSchema.views) {
      newSchema.views = {};
    }
    newSchema.views[identifier] = {
      query: view.query,
      schema: view.schema,
      name: view.name,
      key: view.name,
    };
  });
}

export function addIndexToTable(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  index: { key: string; fields: string[]; unique: boolean },
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    if (!table.indices) {
      table.indices = {};
    }
    table.indices[index.key] = {
      name: index.key,
      fields: index.fields,
      unique: index.unique,
    };
  });
}
export function dropTableIndex(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  key: string,
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    if (table.indices) {
      delete table.indices[key];
    }
  });
}

export function dropTableReference(
  schema: SchemaDescription,
  tableAlias: TableDescription<any>,
  key: string,
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const { table } = getTableFromSchema(newSchema, tableAlias);
    if (table.references) {
      delete table.references[key];
    }
  });
}

export function addRuleToSchema(schema: SchemaDescription, id: string, rule: Rule): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    if (newSchema.rules) {
      newSchema.rules[id] = { id, rule };
    }
  });
}
export function dropRuleFromSchema(schema: SchemaDescription, id: string): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    if (newSchema.rules) {
      delete newSchema.rules[id];
    }
  });
}
export function dropTableFromSchema(schema: SchemaDescription, key: TableDescription<any>): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    if (newSchema.tables) {
      delete newSchema.tables[getTableDescriptionIdentifier(key)];
    }
  });
}
export function dropViewFromSchema(schema: SchemaDescription, key: TableDescription<any>): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    if (newSchema.views) {
      delete newSchema.views[getTableDescriptionIdentifier(key)];
    }
  });
}

export function alterViewFromSchema(
  schema: SchemaDescription,
  viewAlias: TableDescription<any>,
  query: SelectSql<any>,
): SchemaDescription {
  return extendSchema(schema, (newSchema) => {
    const view = getViewFromSchema(newSchema, viewAlias);
    view.query = query;
  });
}
