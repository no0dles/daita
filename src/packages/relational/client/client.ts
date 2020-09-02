import { RelationalRawResult } from '../adapter';
import { SelectClient } from './select-client';
import { UpdateClient } from './update-client';
import { InsertClient } from './insert-client';
import { DeleteClient } from './delete-client';

export interface Client<T>
  extends SelectClient,
    UpdateClient,
    InsertClient,
    DeleteClient {
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery(sql: any): boolean;
}
