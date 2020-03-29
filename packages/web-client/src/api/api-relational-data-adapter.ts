import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  RelationalDataAdapter,
  SqlQuery,
} from '@daita/core';
import * as debug from 'debug';
import {AuthProvider} from '../auth/auth-provider';
import {IdGenerator} from '../id-generator';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';
import {SqlDmlQuery} from '@daita/core/dist/sql/sql-dml-builder';

export class ApiRelationalDataAdapter implements RelationalDataAdapter {
  protected idGenerator: IdGenerator;
  protected auth?: AuthProvider;

  constructor(protected baseUrl: string,
              private globalQuery: {},
              options: { auth?: AuthProvider },
              private handleResponse: (res: AxiosResponse) => void) {
    this.idGenerator = new IdGenerator();
    if (options.auth) {
      this.auth = options.auth;
    }
  }

  protected async send<T>(url: string, data?: any, query?: { [key: string]: string }) {
    try {
      const reqQuery: any = {...query || {}, ...this.globalQuery};
      const qs = Object.keys(reqQuery).map(key => `${key}=${reqQuery[key]}`).join('&');
      const reqUrl = `${this.baseUrl}/api/table/${url}${qs.length > 0 ? '?' + qs : ''}`;
      debug('daita:api:adapter')('send post request to ' + reqUrl);
      const config: AxiosRequestConfig = {};
      if (this.auth?.kind === 'userpass') {
        config.auth = {
          username: this.auth.username,
          password: this.auth.password,
        };
      } else if (this.auth?.kind === 'token') {
        const token = await this.auth.getToken();
        if (token) {
          config.headers = {'Authorization': `Bearer ${token}`};
        }
      }
      const result = await axios.post(reqUrl, data, config);
      this.handleResponse(result);
      return result.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  }

  async raw(
    sql: string | SqlQuery | SqlDmlQuery,
    values?: any[],
  ): Promise<RelationalRawResult> {
    return this.send(`raw`, {sql, values});
  }
}