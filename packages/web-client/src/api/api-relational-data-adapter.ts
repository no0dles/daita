import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {
  AndRootFilter,
  OrRootFilter,
  RelationalDataAdapter,
  RelationalSelectQuery,
  SqlDmlQuery,
  SqlQuery,
} from '@daita/core';
import * as debug from 'debug';
import {AuthProvider} from '../auth/auth-provider';
import {IdGenerator} from '../id-generator';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';

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

  isKind(kind: 'data' | 'migration' | 'transaction'): boolean {
    return kind === 'data';
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

  async count(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<number> {
    return this.send(`${schema.migrationId}/count/${tableName}`, {
      where: query.filter,
    });
  }

  async delete(
    schema: MigrationSchema,
    tableName: string,
    filter: OrRootFilter<any> | AndRootFilter<any> | any | null,
  ): Promise<{ affectedRows: number }> {
    return this.send(`${schema.migrationId}/delete/${tableName}`, {
      where: filter,
    });
  }

  async insert(
    schema: MigrationSchema,
    tableName: string,
    data: any[],
  ): Promise<void> {
    return this.send(`${schema.migrationId}/insert/${tableName}`, {
      data,
    });
  }

  async raw(
    sql: string | SqlQuery | SqlDmlQuery,
    values?: any[],
  ): Promise<RelationalRawResult> {
    return this.send(`raw`, {sql, values});
  }

  async select(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<any[]> {
    return this.send(`${schema.migrationId}/select/${tableName}`, {
      where: query.filter,
      limit: query.limit,
      skip: query.skip,
      orderBy: query.orderBy,
    });
  }

  async update(
    schema: MigrationSchema,
    tableName: string,
    data: any,
    filter: OrRootFilter<any> | AndRootFilter<any> | any | null,
  ): Promise<{ affectedRows: number }> {
    return this.send(`${schema.migrationId}/update/${tableName}`, {
      set: data,
      where: filter,
    });
  }
}