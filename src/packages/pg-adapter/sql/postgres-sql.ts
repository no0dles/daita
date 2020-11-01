import { PostgresListenSql } from './listen-sql';
import { PostgresNotifySql } from './notify-sql';
import { Sql } from '../../relational/sql/sql';

export type PostgresSql = PostgresListenSql | PostgresNotifySql | Sql<any>;
