import {
  AndRootFilter,
  OrRootFilter,
  RelationalSelectQuery,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import axios, {AxiosResponse} from 'axios';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';

export class ApiRelationalDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private baseUrl: string) {
  }

  async count(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<number>;
  async count(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<number>;
  async count(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<number> {
    return this.send(axios.post(`${this.baseUrl}/${schema.migrationId}/count/${tableName}`, {where: query.filter}));
  }

  async delete(schema: MigrationSchema, tableName: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  async delete(schema: MigrationSchema, tableName: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  async delete(schema: MigrationSchema, tableName: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }> {
    return this.send(axios.post(`${this.baseUrl}/${schema.migrationId}/delete/${tableName}`, {where: filter}));
  }

  async insert(schema: MigrationSchema, tableName: string, data: any[]): Promise<void> {
    return this.send(axios.post(`${this.baseUrl}/${schema.migrationId}/insert/${tableName}`, {data}));
  }

  async raw(sql: string, values: any[]): Promise<{ rowCount: number; rows: any[] }> {
    return this.send(axios.post(`${this.baseUrl}/raw`, {sql, values}));
  }

  private async send<T>(promise: Promise<AxiosResponse<T>>) {
    try {
      const result = await promise;
      return result.data;
    } catch (e) {
      if (e.response.status === 500) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  }

  async select(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<any[]>;
  async select(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<any[]>;
  async select(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<any[]> {
    return this.send(axios.post(`${this.baseUrl}/${schema.migrationId}/select/${tableName}`, {
      where: query.filter,
      limit: query.limit,
      skip: query.skip,
      orderBy: query.orderBy,
    }));
  }

  async update(schema: MigrationSchema, tableName: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  async update(schema: MigrationSchema, tableName: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  async update(schema: MigrationSchema, tableName: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }> {
    return this.send(axios.post(`${this.baseUrl}/${schema.migrationId}/update/${tableName}`, {
      set: data,
      where: filter,
    }));
  }
}