import {RelationalSqlBuilder} from './relational-sql-builder';
import {RelationalTransactionAdapter} from './relational-transaction-adapter';

export interface RelationalMigrationAdapter extends RelationalTransactionAdapter {
  sqlBuilder: RelationalSqlBuilder;
}