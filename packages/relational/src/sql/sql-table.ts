import { isSqlSchemaTable, SqlSchemaTable } from "./sql-schema-table";
import { TableInformation } from "../types";

export type SqlTable = string | SqlSchemaTable;

export const isSqlTable = (val: any): val is SqlTable =>
  typeof val === 'string' || isSqlSchemaTable(val);


export function getSqlSchemaTable(table: SqlTable | TableInformation<any>): SqlSchemaTable {
  if (typeof table === "string") {
    return { table };
  } else if (isSqlSchemaTable(table)) {
    return table;
  } else {
    return { table: table.name };
  }
}

export function getSqlTableIdentifier(table: SqlTable | TableInformation<any>) {
  const schemaTable = getSqlSchemaTable(table);
  if (schemaTable.schema) {
    return `${schemaTable.schema}.${schemaTable.table}`;
  }
  return schemaTable.table;
}
