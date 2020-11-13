import { RelationalClient } from '../../relational/client/relational-client';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { RelationalNormalMapper } from './orm-mapper';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter, protected migrationTree: MigrationTree) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(new RelationalNormalMapper().normalizeSql(sql));
  }
}
