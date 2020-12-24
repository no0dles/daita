import { Db, Snippet } from './section';
import { mariadbFormatter } from '../../../packages/mariadb-adapter/formatter/mariadb-formatter';
import { MariadbFormatContext } from '../../../packages/mariadb-adapter/formatter/mariadb-format-context';
import { postgresFormatter } from '../../../packages/pg-adapter/formatters/postgres-formatter';
import { PostgresFormatContext } from '../../../packages/pg-adapter/adapter/postgres-format-context';
import { sqliteFormatter } from '../../../packages/sqlite-adapter/formatter/sqlite-formatter';
import { SqliteFormatContext } from '../../../packages/sqlite-adapter/formatter/sqlite-format-context';
import { failNever } from '../../../packages/common/utils/fail-never';
import { Sql } from '../../../packages/relational/sql/sql';
import { formatSql } from '../../../packages/relational/formatter/format-sql';

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
