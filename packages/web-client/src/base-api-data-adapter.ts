import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';
import axios, {AxiosResponse} from 'axios';
import {AndRootFilter, OrRootFilter, RelationalSelectQuery} from '@daita/core';
import {IdGenerator} from './id-generator';
import * as debug from 'debug';

export class BaseApiDataAdapter {
  protected idGenerator: IdGenerator;

  constructor(protected baseUrl: string, private globalQuery: {}) {
    this.idGenerator = new IdGenerator();
  }

  protected async send<T>(url: string, data?: any, query?: { [key: string]: string }) {
    try {
      const reqQuery: any = {...query || {}, ...this.globalQuery};
      const qs = Object.keys(reqQuery).map(key => `${key}=${reqQuery[key]}`).join('&');
      const reqUrl = `${this.baseUrl}/api/table/${url}${qs.length > 0 ? '?' + qs : ''}`;
      debug('daita:api:adapter')('send post request to ' + reqUrl);
      const result = await axios.post(reqUrl, data, {});
      return result.data;
    } catch (e) {
      if (e.response.status === 500) {
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
    sql: string,
    values: any[],
  ): Promise<{ rowCount: number; rows: any[] }> {
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