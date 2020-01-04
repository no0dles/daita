import {RelationalContext, RelationalDataAdapter} from '@daita/core';
import {testAdapters} from '../index';

export interface AdapterTest {
  name: string;
  context: RelationalContext;
  dataAdapter: RelationalDataAdapter;

  before(): Promise<any>;

  after(): Promise<any>;
}

export function testCase(action: (testAdapter: AdapterTest) => Promise<any>) {
  for (const testAdapter of testAdapters) {
    test(testAdapter.name, async () => {
      await action(testAdapter);
    });
  }
}

export interface SetupAdapterOptions {
  seed?: (testAdapter: AdapterTest) => Promise<any>;
  cleanup?: (testAdapter: AdapterTest) => Promise<any>
  seedOnce?: (testAdapter: AdapterTest) => Promise<any>;
  cleanupOnce?: (testAdapter: AdapterTest) => Promise<any>
}

export function setupAdapters(options: SetupAdapterOptions) {
  beforeAll(async () => {
    console.log('before all');
    for (const setup of testAdapters) {
      await setup.before();
    }
    if (options.seedOnce) {
      for (const testAdapter of testAdapters) {
        await options.seedOnce(testAdapter);
      }
    }
  });

  beforeEach(async () => {
    console.log('before each');
    if (options.seed) {
      for (const testAdapter of testAdapters) {
        await options.seed(testAdapter);
      }
    }
  });

  afterEach(async () => {
    if (options.cleanup) {
      for (const testAdapter of testAdapters) {
        await options.cleanup(testAdapter);
      }
    }
  });

  afterAll(async () => {
    for (const testAdapter of testAdapters) {
      await testAdapter.after();
    }
    if (options.cleanupOnce) {
      for (const testAdapter of testAdapters) {
        await options.cleanupOnce(testAdapter);
      }
    }
  });
}
