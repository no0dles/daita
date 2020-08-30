import { OrmRelationalSchema } from '../schema';
import {RelationalClient} from '../../relational/client';
import {RelationalDataAdapter, RelationalRawResult} from '../../relational/adapter';

export class RelationalBaseContext extends RelationalClient {
  constructor(adapter: RelationalDataAdapter,
              protected schema: OrmRelationalSchema) {
    super(adapter);
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return super.exec(this.schema.getMapper().normalizeSql(sql));
  }
}
