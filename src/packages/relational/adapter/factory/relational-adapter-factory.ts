import { DestroyAdapterOptions } from './destroy-adapter-options';
import {
  CreateDataAdapterOptions,
  isCreateDataAdapterOptionsSingle,
} from './create-data-adapter-options';
import {
  CreateTransactionAdapterOptions,
  isCreateTransactionAdapterOptionsSingle,
} from './create-transaction-adapter-options';
import { CreateAdapterOptions } from './create-adapter-options';

export interface RelationalAdapterFactory {
  destroy(options?: DestroyAdapterOptions): Promise<void>;

  name: string;

  canCreate(connectionString: string): boolean;
}

export function createDataAdapter(options: CreateDataAdapterOptions) {
  const connectionString = getConnectionString(options);
  if (isCreateDataAdapterOptionsSingle(options)) {
    return options.adapter.adapterFactory.createDataAdapter(options);
  } else {
    const adapter = detectAdapter(
      connectionString,
      options.adapters.map((a) => a.adapterFactory),
    );
    return adapter.createDataAdapter({ ...options, connectionString });
  }
}

export function createTransactionAdapter(
  options: CreateTransactionAdapterOptions,
) {
  const connectionString = getConnectionString(options);
  if (isCreateTransactionAdapterOptionsSingle(options)) {
    return options.adapter.adapterFactory.createTransactionAdapter(options);
  } else {
    const adapter = detectAdapter(
      connectionString,
      options.adapters.map((a) => a.adapterFactory),
    );
    return adapter.createTransactionAdapter({ ...options, connectionString });
  }
}

function getConnectionString(options: CreateAdapterOptions) {
  const connectionString = options.connectionString; // ?? typeof window === 'undefined' ? process.env.DATABASE_URL : window.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'unable to detect a connection string, please specify on in the options or provide the environment variable DATABASE_URL',
    );
  }
  return connectionString;
}

function detectAdapter<TAdapter extends RelationalAdapterFactory>(
  connectionString: string,
  adapters: TAdapter[],
): TAdapter {
  const availableAdapters = adapters.filter((a) =>
    a.canCreate(connectionString),
  );
  if (availableAdapters.length === 0) {
    throw new Error(
      `none of the specified adapters is able create [${adapters
        .map((a) => a.name)
        .join(', ')}]`,
    );
  } else if (availableAdapters.length > 1) {
    throw new Error(
      `multiple adapters are configured [${availableAdapters
        .map((a) => a.name)
        .join(', ')}]`,
    );
  }

  return availableAdapters[0];
}
