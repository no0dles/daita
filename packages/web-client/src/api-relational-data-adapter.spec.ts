import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import * as http from 'http';
import {RelationalContext, RelationalDataAdapter, RelationalSchema} from '@daita/core';
import testSchema = require('@daita/core/dist/test/schema');
import {PostgresAdapterTest} from '@daita/core/dist/postgres/postgres.data-adapter.spec';
import {AdapterTest} from '@daita/core/dist/test/test-utils';
import {createApiApp} from '@daita/web/dist/api';
import {ApiRelationalDataAdapter} from './api-relational-data-adapter';

export class ApiAdapterTest implements AdapterTest {
  private server: http.Server | null = null;

  name = 'api-data-adapter';
  context!: RelationalContext;
  dataAdapter!: RelationalDataAdapter;
  isRemote = true;

  constructor(private port: number,
              private backendSetup: AdapterTest,
              private schema: RelationalSchema) {
  }

  async after(): Promise<any> {
    await this.backendSetup.after();
    await new Promise<any>(resolve => {
      if (this.server) {
        this.server.close(resolve);
      } else {
        resolve();
      }
    });
  }

  async before(): Promise<any> {
    await this.backendSetup.before();
    await new Promise<any>(resolve => {
      const app = createApiApp({
        type: 'schema',
        dataAdapter: this.backendSetup.dataAdapter,
        schema: this.schema,
        transactionTimeout: 1000,
      });
      this.server = app.listen(this.port, () => {
        resolve();
      });
    });
    this.dataAdapter = new ApiRelationalDataAdapter(
      `http://localhost:${this.port}`,
    );

    this.context = this.schema.context(this.dataAdapter);
  }
}

describe('api-relational-data-adapter', () => {
  relationalDataAdapterTest(
    new ApiAdapterTest(3003, new PostgresAdapterTest(testSchema), testSchema));
});
