import { SqlDmlQuery, SqlQuery } from "@daita/relational";

export interface SocketExecTransactionEvent {
  sql: SqlQuery | SqlDmlQuery;
  tid: string;
}
