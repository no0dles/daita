import { RelationalClient, RelationalDataAdapter, RelationalRawResult } from '@daita/relational';
import { OrmRelationalSchema } from '../schema';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter,
              protected schema: OrmRelationalSchema) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(this.schema.getMapper().normalizeSql(sql));
  }
}
