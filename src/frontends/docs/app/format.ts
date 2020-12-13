import { Db, Snippet } from './section';
import { mariadbFormatter } from '../../../packages/mariadb-adapter/formatter/mariadb-formatter';
import { MariadbFormatContext } from '../../../packages/mariadb-adapter/formatter/mariadb-format-context';
import { postgresFormatter } from '../../../packages/pg-adapter/formatters/postgres-formatter';
import { PostgresFormatContext } from '../../../packages/pg-adapter/adapter/postgres-format-context';
import { sqliteFormatter } from '../../../packages/sqlite-adapter/formatter/sqlite-formatter';
import { SqliteFormatContext } from '../../../packages/sqlite-adapter/formatter/sqlite-format-context';
import { failNever } from '../../../packages/common/utils/fail-never';
import { isAllDescription } from '../../../packages/relational/sql/keyword/all/all-description';
import { isConcatDescription } from '../../../packages/relational/sql/function/string/concat/concat-description';
import { isGreaterThanDescription } from '../../../packages/relational/sql/operands/comparison/greater-than/greater-than-description';
import { isLowerThanDescription } from '../../../packages/relational/sql/operands/comparison/lower-than/lower-than-description';
import { isFieldDescription } from '../../../packages/relational/sql/keyword/field/field-description';
import { isEqualDescription } from '../../../packages/relational/sql/operands/comparison/equal/equal-description';
import { isCountDescription } from '../../../packages/relational/sql/function/aggregation/count/count-description';
import { isSubSelectDescription } from '../../../packages/relational/sql/dml/select/subquery/sub-select-description';
import { isTableDescription } from '../../../packages/relational/sql/keyword/table/table-description';
import { Sql } from '../../../packages/relational/sql/sql';

export function getSnippet(dbs: Db[], code: Sql<any>, description?: string): Snippet {
  return {
    sourceCodes: [
      { title: 'Code', code: formatSql(code), type: 'typescript' },
      ...dbs.map((db) => ({ code: formatQuery(db, code), title: db, type: 'sql' })),
    ],
    description,
  };
}

export function formatQuery(db: Db, query: any) {
  if (db === 'mariadb') {
    return mariadbFormatter.format(query, new MariadbFormatContext());
  } else if (db === 'postgres') {
    return postgresFormatter.format(query, new PostgresFormatContext());
  } else if (db === 'sqlite') {
    return sqliteFormatter.format(query, new SqliteFormatContext());
  } else {
    failNever(db, 'unknown db');
  }
}

export function formatSql(sql: any, level = 0): string {
  const padding = ' '.repeat(level * 2);
  const nestedPadding = ' '.repeat((level + 1) * 2);
  if (typeof sql === 'number') {
    return sql.toString();
  }
  if (typeof sql === 'string') {
    return `'${sql}'`;
  }
  if (typeof sql === 'object' && sql instanceof Date) {
    return `new Date(${sql.getFullYear()}, ${sql.getMonth()}, ${sql.getDay()})`;
  }
  if (typeof sql === 'object' && sql instanceof Array) {
    return `[\n${sql.map((i) => `${nestedPadding}${formatSql(i, level + 1)}`).join(`,\n`)}\n${padding}]`;
  }
  if (isAllDescription(sql)) {
    if (sql.all.table) {
      return `all(${(<any>sql.all.table).table})`;
    } else {
      return `all()`;
    }
  }
  if (isConcatDescription(sql)) {
    return `concat(${sql.concat.map((c) => formatSql(c, level)).join(', ')})`;
  }
  if (isGreaterThanDescription(sql)) {
    return `greaterThan(${formatSql(sql.greaterThan.left, level)}, ${formatSql(sql.greaterThan.right, level)})`;
  }
  if (isLowerThanDescription(sql)) {
    return `lowerThan(${formatSql(sql.lowerThan.left, level)}, ${formatSql(sql.lowerThan.right, level)})`;
  }
  if (isFieldDescription(sql)) {
    return `field(${(<any>sql.field.table).table}, '${sql.field.key}')`;
  }
  if (isEqualDescription(sql)) {
    return `equal(${formatSql(sql.equal.left, level)}, ${formatSql(sql.equal.right, level)})`;
  }
  if (isCountDescription(sql)) {
    return `count()`;
  }
  if (isSubSelectDescription(sql)) {
    return `subSelect({\n${Object.keys(sql.subSelect)
      .map((k) => `${nestedPadding}${k}: ${formatSql((<any>sql.subSelect)[k], level + 1)},`)
      .join('\n')}\n${padding}})`;
  }

  if (isTableDescription(sql)) {
    return `table(${sql.table})`;
  } else if (typeof sql === 'object') {
    return `{\n${Object.keys(sql)
      .map((k) => `${nestedPadding}${k}: ${formatSql(sql[k], level + 1)},`)
      .join('\n')}\n${padding}}`;
  } else {
    return 'unknown';
  }
}
