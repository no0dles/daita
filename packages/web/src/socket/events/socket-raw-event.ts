import {SqlQuery} from '@daita/core';
import {SqlDmlQuery} from '@daita/core/dist/sql/sql-dml-builder';

export interface SocketRawEvent {
  sql: SqlQuery | SqlDmlQuery;
  tid?: string;
}
