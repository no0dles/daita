import { RelationalAdapter } from '@daita/relational';
import { RelationalOrmAdapter } from './relational-orm-adapter';

export interface RelationalOrmAdapterImplementation<TSql, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalAdapter<TSql> & RelationalOrmAdapter;
}
