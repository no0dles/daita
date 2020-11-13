import { Client, RelationalDataAdapter } from '../../../packages/relational';
import { DataAdapterTestContext } from './data-adapter-test-context';
import { isKind } from '../../../packages/common';

export interface ClientTestContext {
  client: Client<any>;
  adapter: RelationalDataAdapter<any>;

  close(): Promise<void>;
}

export const isClientTestContext = (val: ClientTestContext | DataAdapterTestContext): val is ClientTestContext =>
  isKind(val, ['client', 'adapter']);
