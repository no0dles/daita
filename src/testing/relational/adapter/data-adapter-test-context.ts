import { RelationalDataAdapter } from '../../../packages/relational';

export interface DataAdapterTestContext {
  adapter: RelationalDataAdapter<any>;

  close(): Promise<void>;
}
