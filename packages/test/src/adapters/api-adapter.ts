import {AdapterTest} from '../core/test-utils';
import {RelationalContext, RelationalDataAdapter, RelationalSchema} from '@daita/core';
import {ApiRelationalDataAdapter} from '@daita/web-client';
import {createApiApp} from '@daita/web/dist/api';
import * as http from 'http';

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
        dataAdapter: this.backendSetup.dataAdapter,
        schema: this.schema,
        transactionTimeout: 1000,
      });
      this.server = app.listen(this.port, () => {
        console.log('listens')
        resolve();
      });
    });
    this.dataAdapter = new ApiRelationalDataAdapter(
      `http://localhost:${this.port}`,
    );
    this.context = this.schema.context(this.dataAdapter);
  }
}
