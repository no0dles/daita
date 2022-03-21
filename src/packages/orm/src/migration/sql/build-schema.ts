import {
  isAlterTableAddColumnSql,
  isAlterTableAddForeignKeySql,
  isAlterTableAddPrimaryKeySql,
  isAlterTableDropColumnSql,
  isAlterTableDropConstraintSql,
  isAlterTableRenameSql,
  isCreateTableSql,
  isCreateViewSql,
  isDropTableSql,
  isDropViewSql,
} from '@daita/relational';
import {
  addTableField,
  addTableReference,
  addTableToSchema,
  addViewToSchema,
  doDropTableField,
  dropTableFromSchema,
  dropViewFromSchema,
  extendSchema,
  getTableFromSchema,
  SchemaDescription,
  SchemaTableFieldTypeDescription,
} from '../../schema';
import { failNever } from '@daita/common';
import { OrmSql } from './orm-sql';

export interface TypeAdapter {
  databaseTypeToSchemaType(type: string): { type: SchemaTableFieldTypeDescription; size?: number };
  schemaTypeToDatabaseType(type: SchemaTableFieldTypeDescription, size: number | undefined): string;
}

export function buildSchema(adapter: TypeAdapter, schema: SchemaDescription, sqls: OrmSql[]): SchemaDescription {
  for (const sql of sqls) {
    if (isCreateTableSql(sql)) {
      schema = addTableToSchema(schema, sql.createTable);
      for (const column of sql.columns) {
        const columnType = adapter.databaseTypeToSchemaType(column.type);
        schema = addTableField(schema, sql.createTable, {
          type: columnType.type,
          key: column.name,
          size: columnType.size,
          defaultValue: column.defaultValue,
          required: !!column.notNull,
        });
      }
      for (const [name, foreignKey] of Object.entries(sql.foreignKey || {})) {
        schema = addTableReference(schema, sql.createTable, foreignKey.references.table, {
          name: name,
          onUpdate: foreignKey.onUpdate ?? null,
          onDelete: foreignKey.onDelete ?? null,
        });
      }
    } else if (isDropTableSql(sql)) {
      schema = dropTableFromSchema(schema, sql.dropTable);
    } else if (isCreateViewSql(sql)) {
      schema = addViewToSchema(schema, {
        query: sql.as,
        schema: sql.createView.schema,
        name: sql.createView.table,
      });
    } else if (isDropViewSql(sql)) {
      schema = dropViewFromSchema(schema, sql.dropView);
    } else if (isAlterTableAddColumnSql(sql)) {
      const columnType = adapter.databaseTypeToSchemaType(sql.add.type);
      schema = addTableField(schema, sql.alterTable, {
        type: columnType.type,
        key: sql.add.column,
        size: columnType.size,
        required: sql.add.notNull ?? false,
        defaultValue: sql.add.defaultValue,
      });
    } else if (isAlterTableDropColumnSql(sql)) {
      schema = doDropTableField(schema, sql.alterTable, sql.drop.column);
    } else if (isAlterTableRenameSql(sql)) {
      // TODO
    } else if (isAlterTableAddPrimaryKeySql(sql)) {
      schema = extendSchema(schema, (newSchema) => {
        const table = getTableFromSchema(newSchema, sql.alterTable);
        table.table.primaryKeys = typeof sql.add.primaryKey === 'string' ? [sql.add.primaryKey] : sql.add.primaryKey;
      });
    } else if (isAlterTableAddForeignKeySql(sql)) {
      if (sql.add.constraint) {
        schema = addTableReference(schema, sql.alterTable, sql.add.references.table, {
          name: sql.add.constraint,
          onUpdate: sql.add.onUpdate ?? null,
          onDelete: sql.add.onDelete ?? null,
        });
      }
    } else if (isAlterTableDropConstraintSql(sql)) {
      schema = extendSchema(schema, (newSchema) => {
        const table = getTableFromSchema(newSchema, sql.alterTable);
        if (sql.drop.constraint.endsWith('_pkey')) {
          table.table.primaryKeys = [];
        }
      });
    } else {
      failNever(sql, 'unknown sql');
    }
  }

  return schema;
}
