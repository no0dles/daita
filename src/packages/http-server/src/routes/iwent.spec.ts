import { getServer, httpPost, HttpServerApp } from '@daita/node';
import { createHttpServerApp } from '../app';
import { SqliteRelationalMigrationAdapter } from '../../sqlite-adapter/adapter/sqlite-relational-migration-adapter';
import { Resolvable } from '@daita/common';
import { IwentAdapter } from '../../iwent/iwent-adapter';
import { randomUuid } from '@daita/common';

describe('http-server/routes/iwent', () => {
  let adapter: IwentAdapter;
  let httpApp: HttpServerApp;

  afterAll(async () => {
    await httpApp.close();
    await adapter.close();
  });

  beforeAll(async () => {
    adapter = new SqliteRelationalMigrationAdapter(new Resolvable<string>(':memory:'));
    await adapter.applyContract({
      id: 'init',
      changes: [
        {
          type: 'add_event',
          eventName: 'test',
          requiresAuthentication: false,
          eventType: { type: 'object', name: 'test', props: { title: { type: { type: 'string' }, required: true } } },
        },
        {
          type: 'add_event',
          eventName: 'test2',
          requiresAuthentication: true,
          eventType: { type: 'object', name: 'test', props: { title: { type: { type: 'string' }, required: true } } },
        },
      ],
    });

    httpApp = getServer((port) =>
      createHttpServerApp(
        {
          iwent: {
            adapter,
          },
          authorization: {
            providers: [],
            tokenEndpoints: [],
          },
          cors: false,
        },
        port,
      ),
    );

    await httpApp.start();
  });

  it('should push unauthorized event without authorization', async () => {
    const res = await httpPost(httpApp, `/api/iwent/event/test`, {
      payload: {
        title: 'hey',
      },
      id: randomUuid(),
    });
    expect(res.body).toBe('');
    expect(res.statusCode).toEqual(200);
  });

  it('should not allow to push invalid event type', async () => {
    const res = await httpPost(httpApp, `/api/iwent/event/test`, {
      payload: {
        title: 123,
      },
      id: randomUuid(),
    });
    expect(res.body).not.toBe('');
    expect(res.body.message).toBe('not a valid string');
    expect(res.body.path).toEqual(['title']);
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow to push unknown event', async () => {
    const res = await httpPost(httpApp, `/api/iwent/event/foo`, {
      payload: {
        title: 'hey',
      },
      id: randomUuid(),
    });
    expect(res.body).not.toBe('');
    expect(res.body.message).toBe('unknown type');
    expect(res.statusCode).toEqual(400);
  });

  it('should not allow to push authorized event without authorization', async () => {
    const res = await httpPost(httpApp, `/api/iwent/event/test2`, {
      payload: {
        title: 'hey',
      },
      id: randomUuid(),
    });
    expect(res.body).not.toBe('');
    expect(res.body.message).toBe('not authenticated');
    expect(res.statusCode).toEqual(401);
  });
});
