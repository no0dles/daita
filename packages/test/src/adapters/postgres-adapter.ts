import {RelationalContext, RelationalSchema} from '@daita/core';
import {PostgresDataAdapter} from '@daita/core/dist/postgres';
import {dropDatabase} from '@daita/core/dist/postgres/postgres.util';
import {AdapterTest} from '../core/test-utils';


export class PostgresAdapterTest implements AdapterTest {
  context!: RelationalContext;
  dataAdapter!: PostgresDataAdapter;
  name = 'postgres-data-adapter';

  constructor(private connectionString: string, private schema: RelationalSchema) {

  }

  async after() {
    if (this.dataAdapter) {
      await this.dataAdapter.close();
    }
  }

  async before() {
    await dropDatabase(this.connectionString);
    this.dataAdapter = new PostgresDataAdapter(this.connectionString);
    this.context = this.schema.context(this.dataAdapter);
    await this.context.migration().apply();
  }
}