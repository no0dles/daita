import {
  getFieldNamesFromSchemaTable,
  getFieldsFromSchemaTable,
  getIndicesFromSchemaTable,
  getReferencesFromSchemaTable,
  getSeedsFromSchemaTable,
  getTableDescriptionIdentifier,
  getTableFromSchema,
  SchemaDescription,
  SchemaRuleDescription,
  SchemaTableDescription,
  SchemaTableFieldDescription,
  SchemaTableIndexDescription,
  SchemaTableReferenceDescription,
  SchemaTableSeedDescription,
  SchemaViewDescription,
} from '../../schema/description/relational-schema-description';
import { MigrationStep } from '../migration-step';
import { merge, mergeArray, MergeListResult } from '@daita/common';
import { table } from '@daita/relational';
import { isTableReferenceRequiredInTable } from '../../schema/description/relational-table-reference-description';
import { sortSteps } from '../sort-steps';

interface GenerateOptions<T> {
  addFunction: (schema: SchemaDescription, result: T) => MigrationStep[];
  mergeFunction: (schema: SchemaDescription, prev: T, next: T) => MigrationStep[];
  removeFunction: (schema: SchemaDescription, prev: T) => MigrationStep[];
}

function generateSteps<T>(
  newSchema: SchemaDescription,
  merge: MergeListResult<T>,
  options: GenerateOptions<T>,
): MigrationStep[] {
  const steps: MigrationStep[] = [];

  for (const removed of merge.removed) {
    steps.push(...options.removeFunction(newSchema, removed.item));
  }
  for (const merged of merge.merge) {
    steps.push(...options.mergeFunction(newSchema, merged.current, merged.target));
  }
  for (const added of merge.added) {
    steps.push(...options.addFunction(newSchema, added.item));
  }

  return steps;
}

const tableFields: GenerateOptions<{ table: SchemaTableDescription; field: SchemaTableFieldDescription }> = {
  addFunction: (newSchema, { table, field }) => {
    return [
      {
        kind: 'add_table_field',
        table: table.name,
        schema: table.schema,
        fieldName: field.name,
        type: field.type,
        size: field.size ?? undefined,
        required: field.required,
        defaultValue: field.defaultValue,
      },
    ];
  },
  removeFunction: (schema, { table, field }) => {
    return [
      {
        kind: 'drop_table_field',
        table: table.name,
        fieldName: field.name,
        schema: table.schema,
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

function extendMergeResult<S, T>(source: MergeListResult<S>, extend: (source: S) => T): MergeListResult<T> {
  return {
    added: source.added.map((added) => ({
      key: added.key,
      item: extend(added.item),
    })),
    removed: source.removed.map((removed) => ({
      key: removed.key,
      item: extend(removed.item),
    })),
    merge: source.merge.map((merge) => ({
      key: merge.key,
      current: extend(merge.current),
      target: extend(merge.target),
    })),
  };
}

const tableOptions: GenerateOptions<SchemaTableDescription> = {
  addFunction: (schema, table) => {
    const steps: MigrationStep[] = [];
    steps.push({ kind: 'add_table', table: table.name, schema: table.schema });

    for (const { field } of getFieldsFromSchemaTable(table)) {
      steps.push(...tableFields.addFunction(schema, { field, table }));
    }

    steps.push(...primaryKeyOptions.addFunction(schema, { table, primaryKeys: table.primaryKeys }));

    for (const index of getIndicesFromSchemaTable(table)) {
      steps.push(...indexOptions.addFunction(schema, { table, index }));
    }

    for (const foreignKey of getReferencesFromSchemaTable(table)) {
      steps.push(...foreignKeyOptions.addFunction(schema, { table, foreignKey }));
    }

    for (const seed of getSeedsFromSchemaTable(table)) {
      steps.push(...seedOptions.addFunction(schema, { table, seed }));
    }

    return steps;
  },
  removeFunction: (schema, table) => {
    return [{ kind: 'drop_table', table: table.name, schema: table.schema }];
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

    const kindOrder: MigrationStep['kind'][] = [
      'delete_seed',
      'drop_index',
      'drop_table_foreign_key',
      'drop_table_primary_key',
      'drop_table_field',
      'add_table_field',
      'create_index',
      'add_table_primary_key',
      'add_table_foreign_key',
      'insert_seed',
      'update_seed',
    ];

    const steps = sortSteps(
      [
        ...generateSteps(schema, mergedFields, tableFields),
        ...(mergedPrimaryKeys.hasChanges
          ? primaryKeyOptions.mergeFunction(
              schema,
              { table: current, primaryKeys: current.primaryKeys },
              { table: target, primaryKeys: target.primaryKeys },
            )
          : []),
        ...generateSteps(schema, mergedReferences, foreignKeyOptions),
        ...generateSteps(schema, mergedIndices, indexOptions),
        ...generateSteps(schema, mergedSeeds, seedOptions),
      ],
      kindOrder,
    );
    return steps;
  },
};

const seedOptions: GenerateOptions<{ table: SchemaTableDescription; seed: SchemaTableSeedDescription }> = {
  addFunction: (schema, { table, seed }) => {
    return [
      {
        kind: 'insert_seed',
        table: table.name,
        schema: table.schema,
        keys: seed.seedKeys,
        seed: seed.seed,
      },
    ];
  },
  removeFunction: (schema, { table, seed }) => {
    return [
      {
        kind: 'delete_seed',
        keys: seed.seedKeys,
        table: table.name,
        schema: table.schema,
      },
    ];
  },
  mergeFunction: (schema, current, target) => {
    if (
      JSON.stringify(current.seed) === JSON.stringify(target.seed) //TODO does not work for regex
    ) {
      return [];
    }

    return [
      {
        kind: 'update_seed',
        keys: target.seed.seedKeys,
        seed: target.seed.seed,
        table: target.table.name,
        schema: target.table.schema,
      },
    ];
  },
};

const foreignKeyOptions: GenerateOptions<{
  table: SchemaTableDescription;
  foreignKey: SchemaTableReferenceDescription;
}> = {
  addFunction: (schema, opts) => {
    const foreignTable = getTableFromSchema(schema, table(opts.foreignKey.table, opts.foreignKey.schema));
    return [
      {
        kind: 'add_table_foreign_key',
        table: opts.table.name,
        schema: opts.table.schema,
        name: opts.foreignKey.name,
        fieldNames: getFieldNamesFromSchemaTable(
          opts.table,
          opts.foreignKey.keys.map((k) => k.field),
        ),
        foreignFieldNames: getFieldNamesFromSchemaTable(
          foreignTable.table,
          opts.foreignKey.keys.map((k) => k.foreignField),
        ),
        foreignTable: foreignTable.table.name,
        foreignTableSchema: foreignTable.table.schema,
        required: isTableReferenceRequiredInTable(opts.table, opts.foreignKey),
        onDelete: opts.foreignKey.onDelete ?? undefined,
        onUpdate: opts.foreignKey.onUpdate ?? undefined,
      },
    ];
  },
  removeFunction: (schema, { table, foreignKey }) => {
    return [
      {
        kind: 'drop_table_foreign_key',
        table: table.name,
        schema: table.schema,
        name: foreignKey.name,
      },
    ];
  },
  mergeFunction: (schema, current, target) => {
    const tableKeys = mergeArray(
      current.foreignKey.keys,
      target.foreignKey.keys,
      (first, second) => first.foreignField === second.foreignField && first.field === second.field,
    );
    if (
      tableKeys.hasChanges ||
      current.foreignKey.onUpdate !== target.foreignKey.onUpdate ||
      current.foreignKey.onDelete !== target.foreignKey.onDelete ||
      current.foreignKey.name !== target.foreignKey.name
    ) {
      return [...foreignKeyOptions.removeFunction(schema, current), ...foreignKeyOptions.addFunction(schema, target)];
    }
    return [];
  },
};

const primaryKeyOptions: GenerateOptions<{ table: SchemaTableDescription; primaryKeys: string[] | undefined | null }> =
  {
    addFunction: (schema, { table, primaryKeys }) => {
      if (!primaryKeys) {
        return [];
      }

      return [
        {
          kind: 'add_table_primary_key',
          table: table.name,
          schema: table.schema,
          fieldNames: getFieldNamesFromSchemaTable(table, primaryKeys),
        },
      ];
    },
    removeFunction: (schema, { table, primaryKeys }) => {
      if (!primaryKeys) {
        return [];
      }

      return [
        {
          kind: 'drop_table_primary_key',
          schema: table.schema,
          table: table.name,
        },
      ];
    },
    mergeFunction: (schema, current, target) => {
      const fields = mergeArray(current.primaryKeys, target.primaryKeys);
      if (fields.hasChanges) {
        return [...primaryKeyOptions.removeFunction(schema, current), ...primaryKeyOptions.addFunction(schema, target)];
      }
      return [];
    },
  };

const ruleOptions: GenerateOptions<SchemaRuleDescription> = {
  addFunction: (schema, rule) => {
    return [{ kind: 'add_rule', rule: rule.rule, ruleId: rule.id }];
  },
  removeFunction: (schema, rule) => {
    return [{ kind: 'drop_rule', ruleId: rule.id }];
  },
  mergeFunction: (schema, rule) => {
    // rule id is already comparing content and there should never be a merge
    return [];
  },
};

const viewOptions: GenerateOptions<SchemaViewDescription> = {
  addFunction: (schema, view) => {
    return [
      {
        kind: 'add_view',
        view: view.name,
        schema: view.schema,
        query: view.query,
      },
    ];
  },
  removeFunction: (schema, view) => {
    return [{ kind: 'drop_view', schema: view.schema, view: view.name }];
  },
  mergeFunction: (schema, current, target) => {
    const currentSql = JSON.stringify(current.query);
    const targetSql = JSON.stringify(target.query);
    if (currentSql !== targetSql) {
      return [
        {
          kind: 'alter_view',
          view: current.name,
          schema: current.schema,
          query: target.query,
        },
      ];
    }

    return [];
  },
};

const indexOptions: GenerateOptions<{ table: SchemaTableDescription; index: SchemaTableIndexDescription }> = {
  addFunction: (schema, { table, index }) => {
    return [
      {
        kind: 'create_index',
        table: table.name,
        schema: table.schema,
        unique: index.unique,
        name: index.name,
        fields: getFieldNamesFromSchemaTable(table, index.fields),
      },
    ];
  },
  removeFunction: (schema, { table, index }) => {
    return [
      {
        kind: 'drop_index',
        table: table.name,
        schema: table.schema,
        name: index.name,
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

export function generateRelationalMigrationSteps(currentSchema: SchemaDescription, newSchema: SchemaDescription) {
  const steps: MigrationStep[] = [];

  const mergedTables = merge(currentSchema.tables, newSchema.tables);
  const mergedViews = merge(currentSchema.views, newSchema.views);
  const mergedRules = merge(currentSchema.rules, newSchema.rules);

  steps.push(...generateSteps(newSchema, mergedTables, tableOptions));
  steps.push(...generateSteps(newSchema, mergedViews, viewOptions));
  steps.push(...generateSteps(newSchema, mergedRules, ruleOptions));

  return reorderSteps(
    steps.map((step) => {
      if (step.kind === 'drop_rule' || step.kind === 'add_rule') {
        return step;
      }
      if (step.schema === undefined || step.schema === null) {
        delete step.schema;
      }
      return step;
    }),
  );
}

export function reorderSteps(steps: MigrationStep[]): MigrationStep[] {
  const result: MigrationStep[] = [...steps];
  const tables: string[] = [];
  const tableIndex: number[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.kind === 'add_table') {
      const tableKey = getTableDescriptionIdentifier({ table: step.table, schema: step.schema });
      tables.push(tableKey);
      tableIndex.push(i);
    } else if (step.kind === 'add_table_foreign_key') {
      const tableKey = getTableDescriptionIdentifier({ table: step.table, schema: step.schema });
      let currentTableStartIndex = tableIndex[tables.indexOf(tableKey)];
      const foreignTable = getTableDescriptionIdentifier({ table: step.foreignTable, schema: step.foreignTableSchema });
      const hasAddForeignTable = steps.some(
        (s) =>
          s.kind === 'add_table' &&
          getTableDescriptionIdentifier({ table: s.table, schema: s.schema }) === foreignTable,
      );
      if (tables.indexOf(foreignTable) === -1 && hasAddForeignTable) {
        //move steps
        for (let j = i; j < result.length; j++) {
          const moveStep = result[j];
          if (
            moveStep.kind === 'add_table' ||
            moveStep.kind === 'add_table_field' ||
            moveStep.kind === 'add_table_primary_key' ||
            moveStep.kind === 'add_table_foreign_key' ||
            moveStep.kind === 'drop_table_field'
          ) {
            const moveStepKey = getTableDescriptionIdentifier({ table: moveStep.table, schema: moveStep.schema });
            if (moveStepKey === foreignTable) {
              result.splice(currentTableStartIndex, 0, ...result.splice(j, 1));
              j--;
              currentTableStartIndex++;
            }
          }
        }
      }
    }
  }
  return result;
}
