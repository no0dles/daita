import { AlterTableRenameSql, CreateIndexSql, field, InsertSql } from '@daita/relational';
import { CreateTableForeignKey, CreateTableSql } from '@daita/relational';
import { DropTableSql } from '@daita/relational';
import { table } from '@daita/relational';
import {
  getFieldNamesFromSchemaTable,
  getFieldsFromSchemaTable,
  getReferencesFromSchemaTable,
  getTableFromSchema,
  SchemaDescription,
  SchemaTableDescription,
} from '@daita/orm';
import { PragmaSql } from '../sql/pragma-sql';

export type MigrateTableSql =
  | InsertSql<any>
  | CreateTableSql
  | DropTableSql
  | AlterTableRenameSql
  | CreateIndexSql<any>
  | PragmaSql;

export function migrateTableAction(
  targetSchema: SchemaDescription,
  targetTable: SchemaTableDescription,
): MigrateTableSql[] {
  const currentTableAlias = table(targetTable.name, targetTable.schema);
  const newTableAlias = table('new_' + targetTable.name, targetTable.schema);
  const newFields = getFieldsFromSchemaTable(targetTable).map((f) => f.field);
  const newReferences = getReferencesFromSchemaTable(targetTable);
  const foreignKey = newReferences.reduce<{ [key: string]: CreateTableForeignKey }>((refs, ref) => {
    const refTable = getTableFromSchema(targetSchema, table(ref.table, ref.schema));
    refs[ref.name] = {
      key: getFieldNamesFromSchemaTable(
        targetTable,
        ref.keys.map((k) => k.field),
      ),
      references: {
        primaryKey: getFieldNamesFromSchemaTable(
          refTable.table,
          ref.keys.map((k) => k.foreignField),
        ),
        table: table(refTable.table.name, refTable.table.schema),
      },
    };
    return refs;
  }, {});

  const sqls: MigrateTableSql[] = [
    {
      pragma: 'foreign_keys',
      set: 'OFF',
    },
    {
      createTable: newTableAlias,
      columns: newFields,
      foreignKey,
    },
    {
      into: newTableAlias,
      insert: {
        select: newFields.reduce<{ [key: string]: any }>((map, fld) => {
          map[fld.name] = field(currentTableAlias, fld.name);
          return map;
        }, {}),
        from: currentTableAlias,
      },
    },
    {
      dropTable: currentTableAlias,
    },
    {
      alterTable: newTableAlias,
      renameTo: targetTable.schema ? `${targetTable.schema}-${targetTable.name}` : targetTable.name,
    },
    {
      pragma: 'foreign_keys',
      set: 'ON',
    },
  ];
  for (const [indexName, index] of Object.entries(targetTable.indices || {})) {
    sqls.push({
      createIndex: indexName,
      on: currentTableAlias,
      columns: index.fields,
      unique: index.unique ?? false,
    });
  }
  // TODO views?

  return sqls;
}
