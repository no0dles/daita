import { isAllDescription, isSingleFieldSelect, SelectSql } from '../sql';

export function mapResult(sql: SelectSql<any>, rows: any[]): any[] {
  if (rows.length === 0) {
    return rows;
  }

  const fields = sql.select;
  if (typeof fields === 'object') {
    if (isSingleFieldSelect(fields)) {
      return rows.map((row) => row[Object.keys(row)[0]]);
    }

    if (isAllDescription(fields)) {
      return rows;
    }

    const mappedRows: any[] = [];
    for (const row of rows) {
      const mappedRow: any = {};
      for (const key of Object.keys(row)) {
        const parts = key.split('.');
        if (parts.length === 1) {
          mappedRow[key] = row[key];
        } else {
          let value = mappedRow;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!value[parts[i]]) {
              value[parts[i]] = {};
            }
            value = value[parts[i]];
          }
          value[parts[parts.length - 1]] = row[key];
        }
      }
      mappedRows.push(mappedRow);
    }
    return mappedRows;
  } else {
    return rows.map((row) => row[Object.keys(row)[0]]);
  }
}
