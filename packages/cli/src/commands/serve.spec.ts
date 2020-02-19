import {setupEnv} from '../test/utils';
import {ApiRelationalDataAdapter} from '@daita/web-client';
import {expect} from 'chai';
import {Defer} from '@daita/core';

describe('cli serve', () => {
  it(`should serve auth`, setupEnv('serve-auth', async (ctx) => {
    // ctx.env('POSTGRES_URI', 'postgres://postgres:postgres@localhost/postgres');
    // const defer = new Defer<void>();
    //
    // ctx.expectConsoleOutput('listening on http://localhost:8765').then(async () => {
    //   const client = new ApiRelationalDataAdapter('http://localhost:8765');
    //   const result = await client.raw('SELECT now() as date', []);
    //   expect(result.rowCount).to.be.eq(1);
    //   expect(result.rows[0].date).to.not.be.eq(null);
    //   expect(result.rows[0].date).to.not.be.eq(undefined);
    //   serveCmd.server.close();
    //   defer.resolve();
    // });
    // const serveCmd = await ctx.run('serve');
    // await defer.promise;
  }, {schema: 'auth-schema-migrated'}));
});