import { SqlDmlQuery, SqlQuery } from "@daita/relational";

export interface SocketRawEvent {
  sql: SqlQuery | SqlDmlQuery;
}
