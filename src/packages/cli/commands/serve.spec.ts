import { setupEnv } from '../tests/utils.test';
import { HttpTransactionAdapter } from '../../http-adapter';
import { Defer } from '../../common/utils';

describe('cli serve', () => {
  it(
    `should serve`,
    setupEnv(
      'serve',
      async (ctx) => {
        ctx.env(
          'DATABASE_URL',
          'postgres://postgres:postgres@localhost/postgres',
        );
        const defer = new Defer<void>();

        const serve = ctx.run('serve --disable-auth');
        serve.onStdOut(async (text) => {
          if (text.indexOf('listening on http://localhost:8765') >= 0) {
            const client = new HttpTransactionAdapter(
              'http://localhost:8765',
              null,
            );
            const result = await client.exec({ select: { date: 'test' } });
            expect(result.rowCount).toEqual(1);
            expect(result.rows[0].date).not.toBeNull();
            expect(result.rows[0].date).not.toBeUndefined();
            serve.cancel();
          }
        });
        serve.onStdErr((text) => {
          if (!defer.isRejected) {
            defer.reject(text);
          }
        });
        await serve.finished;
      },
      { schema: 'auth-schema-migrated' },
    ),
  );
});
