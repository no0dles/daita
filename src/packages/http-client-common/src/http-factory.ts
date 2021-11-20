import { Http } from './http';
import { AuthProvider } from './auth-provider';

export function getHttpFactory(baseUrl: string, auth?: AuthProvider): Http {
  if (typeof window === 'undefined') {
    const { NodeHttp } = require('./node-http');
    return new NodeHttp(baseUrl, auth);
  } else {
    const { BrowserHttp } = require('./browser-http');
    return new BrowserHttp(baseUrl, auth);
  }
}
