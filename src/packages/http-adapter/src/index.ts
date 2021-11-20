import { HttpAdapterImplementation } from './adapter-implementation';
import { BrowserAuth, getHttpFactory, TokenIssuer } from '@daita/http-client-common';

export * from './adapter-implementation';
export * from './browser';
export * from './countdown';
export * from './error-handling';
export * from './http-adapter';
export * from './http-data-adapter';
export * from './http-transaction-adapter';
export * from './http-transaction-data-adapter';
export * from './test-adapter-implementation';

export const adapter = new HttpAdapterImplementation();

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(getHttpFactory(baseUrl), storage ?? localStorage);
}
