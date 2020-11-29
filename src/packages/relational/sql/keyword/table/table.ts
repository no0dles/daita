import { TableDescription } from './table-description';
import { Constructable } from '../../../../common/types/constructable';

export function table(table: string, schema?: string): TableDescription<any>;
export function table<T>(type: Constructable<T>): TableDescription<T>;
export function table<T>(typeOrTable: Constructable<T> | string, schema?: string): TableDescription<T> {
  if (typeof typeOrTable === 'string') {
    if (schema) {
      return { table: typeOrTable, schema };
    } else {
      return { table: typeOrTable };
    }
  } else {
    const table: TableDescription<T> = { table: typeOrTable.name };
    if ('table' in typeOrTable) {
      table.table = (typeOrTable as any).table;
    }
    if ('schema' in typeOrTable) {
      table.schema = (typeOrTable as any).schema;
    }
    return table;
  }
}
