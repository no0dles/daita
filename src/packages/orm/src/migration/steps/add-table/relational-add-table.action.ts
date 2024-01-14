import { RelationalAddTableMigrationStep } from './relational-add-table.migration-step';
import { CreateTableForeignKey, CreateTableSql } from '@daita/relational';
import { table } from '@daita/relational';
import { isAddTableFieldStep } from '../add-table-field/relational-add-table-field.migration-step';
import { MigrationDescription } from '../../migration-description';
import { isAddTableForeignKeyStep } from '../add-table-foreign-key';

export function addTableAction(step: RelationalAddTableMigrationStep, migration: MigrationDescription) {
  const foreignKeySteps = migration.steps
    .filter(isAddTableForeignKeyStep)
    .filter((s) => s.table === step.table && s.schema === step.schema);

  const foreignKeys = foreignKeySteps.reduce<{ [key: string]: CreateTableForeignKey }>((keys, step) => {
    keys[step.name] = {
      references: {
        table: table(step.foreignTable, step.foreignTableSchema),
        primaryKey: step.foreignFieldNames,
      },
      onDelete: step.onDelete,
      onUpdate: step.onUpdate,
      key: step.fieldNames,
    };
    return keys;
  }, {});

  const sql: CreateTableSql = {
    createTable: table(step.table, step.schema),
    columns: migration.steps
      .filter(isAddTableFieldStep)
      .filter((s) => s.table === step.table && s.schema === step.schema)
      .map((columnStep) => ({
        name: columnStep.fieldName,
        type: columnStep.type,
        size: columnStep.size,
        primaryKey: migration.steps.some(
          (s) =>
            s.kind === 'add_table_primary_key' &&
            s.schema === step.schema &&
            s.table === step.table &&
            s.fieldNames.indexOf(columnStep.fieldName) >= 0,
        ),
        notNull: false,
      })),
    foreignKey: foreignKeys,
  };
  return sql;
}
