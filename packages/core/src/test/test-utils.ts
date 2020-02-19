import {RelationalContext, RelationalDataAdapter} from '../index';

export interface AdapterTest {
  name: string;
  context: RelationalContext;
  dataAdapter: RelationalDataAdapter;
  isRemote: boolean;

  before(): Promise<any>;

  after(): Promise<any>;
}

export interface SetupAdapterOptions {
  seed?: (testAdapter: AdapterTest) => Promise<any>;
  cleanup?: (testAdapter: AdapterTest) => Promise<any>
  seedOnce?: (testAdapter: AdapterTest) => Promise<any>;
  cleanupOnce?: (testAdapter: AdapterTest) => Promise<any>
}

export function setupAdapters(adapterTest: AdapterTest, options: SetupAdapterOptions = {}) {
  beforeAll(async () => {
    await adapterTest.before();
    if (options.seedOnce) {
      await options.seedOnce(adapterTest);
    }
  });

  beforeEach(async () => {
    if (options.seed) {
      await options.seed(adapterTest);
    }
  });

  afterEach(async () => {
    if (options.cleanup) {
      await options.cleanup(adapterTest);
    }
  });

  afterAll(async () => {
    await adapterTest.after();
    if (options.cleanupOnce) {
      await options.cleanupOnce(adapterTest);
    }
  });
}
