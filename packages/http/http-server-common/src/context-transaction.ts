import { Debouncer, Defer } from "@daita/common";
import { RelationalDataAdapter, RelationalMigrationAdapter, RelationalTransactionAdapter } from "@daita/relational";

export interface ContextTransaction {
  adapter: RelationalDataAdapter | RelationalTransactionAdapter | RelationalMigrationAdapter;
  commitDefer: Defer<void>;
  resultDefer: Defer<void>;
  debouncer: Debouncer;
}
