import { SelectClient } from './select-client';
import { UpdateClient } from './update-client';
import { InsertClient } from './insert-client';
import { DeleteClient } from './delete-client';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';

export interface Client<T> extends SelectClient, UpdateClient, InsertClient, DeleteClient {
  dataAdapter: RelationalDataAdapter<T>;
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery<S = any>(sql: S): this is Client<T | S>;
  close(): Promise<void>;
}
