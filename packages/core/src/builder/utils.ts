import { SqlSchemaTableField } from '../sql/sql-schema-table-field';
import { isSqlSchemaTable, SqlSchemaTable } from '../sql/sql-schema-table';

export function getPathFromSelector(selector: (value: any) => any): string[] {
  const selectorValue = getSelectorPath();
  return selector(selectorValue)._path;
}

export function getTableFromSelector(
  selector: (value: any) => any,
): string | null {
  return getPathFromSelector(selector).join('.');
}

export function getFieldFromSelector(
  selector: (value: any) => any,
): SqlSchemaTableField {
  const path = getPathFromSelector(selector);
  const field = path.splice(path.length - 1, 1)[0];
  const table = path.join('.');

  if (table) {
    return {
      table,
      field,
    };
  } else {
    return {
      field,
    };
  }
}

export function getSelectorPath(path: string[] = []): any {
  const handler = {
    get: (obj: any, prop: any) => {
      if (prop === '_path') {
        return path;
      }

      return getSelectorPath([...path, prop]);
    },
  };

  return new Proxy({}, handler);
}

export function getSqlTable(type: TableInformation<any>): SqlSchemaTable {
  if (typeof type === 'string') {
    return { table: type };
  } else if (isSqlSchemaTable(type)) {
    if (type.schema) {
      return { table: type.table, schema: type.schema };
    } else {
      return { table: type.table };
    }
  } else {
    return { table: type.name };
  }
}

export function deepClone<T extends object>(value: T): T {
  const clone: any = Object.create(value);
  for (const key of Object.keys(value)) {
    const prop = (value as any)[key];
    if (
      typeof prop === 'string' ||
      typeof prop === 'number' ||
      typeof prop === 'boolean' ||
      prop instanceof Date ||
      prop === undefined ||
      prop === null
    ) {
      clone[key] = prop;
    } else if (prop instanceof Array) {
      const cloneArray: any[] = [];
      for (const item of prop) {
        cloneArray.push(deepClone(item));
      }
      clone[key] = cloneArray;
    } else {
      clone[key] = deepClone(prop);
    }
  }
  return clone;
}
