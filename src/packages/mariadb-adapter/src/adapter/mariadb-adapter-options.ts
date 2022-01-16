import { isKind } from '@daita/common';

export type MariadbAdapterOptions = MariadbAdapterConnectionStringOptions; // | MariadbAdapterConfigOptions;

export interface MariadbAdapterConnectionStringOptions {
  connectionString: string;
}

// export interface MariadbAdapterConfigOptions {
//   user: string;
//   database: string;
//   password: string;
//   host: string;
//   port?: number;
//   ssl?: boolean;
// }

export const isConnectionStringOptions = (val: MariadbAdapterOptions): val is MariadbAdapterConnectionStringOptions =>
  isKind(val, ['connectionString']);
