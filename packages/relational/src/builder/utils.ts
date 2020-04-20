import { SqlSchemaTableField } from '../sql/sql-schema-table-field';

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
