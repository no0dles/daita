import { RelationalClient } from '../../relational/client/relational-client';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter, protected schema: OrmRelationalSchema) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(this.schema.getMapper().normalizeSql(sql));
  }
}
