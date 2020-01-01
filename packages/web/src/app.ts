import * as http from 'http';
import {getApi} from './api';
import {createSocketApp} from './socket';
import {AppOptions} from './app-options';

export function getApp(options: AppOptions) {
  const app = getApi(options);
  const server = new http.Server(app);
  return createSocketApp(server, options);
}
