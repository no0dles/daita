import * as http from 'http';
import { createApiApp } from './api';

export function getApp(options: AppOptions) {
  const app = createApiApp(options);
  const server = new http.Server(app);
  return createSocketApp(server, options);
}
