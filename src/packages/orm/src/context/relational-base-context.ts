import { RelationalClient } from '@daita/relational';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { MigrationTree } from '../migration/migration-tree';
import { RelationalNormalMapper } from './orm-mapper';
import { Resolvable } from '@daita/common';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter, protected migrationTree: Resolvable<MigrationTree>) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(new RelationalNormalMapper().normalizeSql(sql));
  }
}
