import { isCreateTableSql } from '@daita/relational';
import { getTableDescriptionIdentifier } from '../schema';

export function orderSqls<T>(sqls: T[]): T[] {
  const result: T[] = [...sqls];

  for (let i = 0; i < result.length; i++) {
    const sql = result[i];
    if (isCreateTableSql(sql)) {
      if (sql.foreignKey) {
        const foreignKeys = Object.values(sql.foreignKey);
        for (const foreignKey of foreignKeys) {
          const key = getTableDescriptionIdentifier(foreignKey.references.table);
          const otherCreateSqlIndex = result.findIndex(
            (otherSql) => isCreateTableSql(otherSql) && getTableDescriptionIdentifier(otherSql.createTable) === key,
          );
          if (otherCreateSqlIndex > i) {
            result.splice(otherCreateSqlIndex, 0, ...result.splice(i, 1));
            i--;
            break;
          }
        }
      }
    }
  }
  return result;
}
