import { setupEnv } from '../test/utils';
import { Defer } from '@daita/common';
import { HttpTransactionAdapter } from '@daita/http-adapter';

describe('cli serve', () => {
  it(`should serve`, setupEnv('serve', async ctx => {
    ctx.env('DATABASE_URL', 'postgres://postgres:postgres@localhost/postgres');
    const defer = new Defer<void>();

    const serve = ctx.run('serve');
    serve.onStdOut(async text => {
      if (text.indexOf('listening on http://localhost:8765') >= 0) {
        const client = new HttpTransactionAdapter('http://localhost:8765', null);
        const result = await client.exec({ select: [{value: 'test', alias: 'date'}] });
        expect(result.rowCount).toEqual(1);
        expect(result.rows[0].date).not.toBeNull();
        expect(result.rows[0].date).not.toBeUndefined();
        serve.cancel();
      }
    });
    serve.onStdErr(text => {
      defer.reject(text);
    });
    await serve.finished;
  }, { schema: 'auth-schema-migrated' }));
});
