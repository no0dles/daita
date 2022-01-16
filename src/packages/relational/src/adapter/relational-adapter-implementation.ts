import { RelationalAdapter } from './relational-adapter';

export interface RelationalAdapterImplementation<TAdapter extends RelationalAdapter<TSql>, TSql, TOptions> {
  getRelationalAdapter(options: TOptions): TAdapter;
}
