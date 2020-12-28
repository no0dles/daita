import { HttpAdapterImplementation } from './adapter-implementation';
import { BrowserAuth, TokenIssuer } from '../http-client-common/auth-provider';
import { getHttpFactory } from '../http-client-common/http-factory';

export const adapter = new HttpAdapterImplementation();

export function createTokenIssuer(baseUrl: string, storage?: Storage): TokenIssuer {
  return new BrowserAuth(getHttpFactory(baseUrl), storage ?? localStorage);
}
