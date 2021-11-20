import { RelationalClient } from '@daita/relational/client/relational-client';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '@daita/relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '@daita/relational/adapter/relational-data-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { RelationalNormalMapper } from './orm-mapper';
import { Resolvable } from '@daita/common/utils/resolvable';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter, protected migrationTree: Resolvable<MigrationTree>) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(new RelationalNormalMapper().normalizeSql(sql));
  }
}
