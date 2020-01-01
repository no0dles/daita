import {
  AndRootFilter,
  OrRootFilter,
  RelationalDataAdapter,
  RelationalSelectQuery,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';
import {Defer} from './defer';
import * as client from 'socket.io-client';
import {RelationalSqlBuilder} from '@daita/core/dist/adapter/relational-sql-builder';

export class SocketRelationalDataAdapter implements RelationalTransactionDataAdapter {
  private socket: SocketIOClient.Socket;
  private defers: { [key: string]: Defer<any> } = {};

  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private baseUrl: string) {
    this.socket = client.connect(baseUrl);
    const events = ['insert', 'update', 'select', 'delete', 'raw', 'count'];
    for (const event of events) {
      this.socket.on(event, (data: any) => {
        this.defers[data.cid].resolve(data.result);
        delete this.defers[data.cid];
      });
    }
    this.socket.on('err', (data: any) => {
      this.defers[data.cid].reject(new Error(data.err));
      delete this.defers[data.cid];
    });
  }

  close() {
    this.socket.close();
  }

  private generateCid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  count(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<number>;
  count(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<number>;
  count(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<number> {
    return this.emit('count', {
      migrationId: schema.migrationId,
      table,
      where: query.filter,
    });
  }

  delete(schema: MigrationSchema, table: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  delete(schema: MigrationSchema, table: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  delete(schema: MigrationSchema, table: string, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }> {
    return this.emit('delete', {migrationId: schema.migrationId, table, where: filter});
  }

  private emit<T>(event: string, data: T) {
    const cid = this.generateCid();
    const defer = new Defer<any>();
    this.defers[cid] = defer;
    this.socket.emit(event, {...data, cid: cid});
    return defer.promise;
  }

  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void>;
  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void>;
  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void> {
    return this.emit('insert', {migrationId: schema.migrationId, table, data});
  }

  raw(sql: string, values: any[]): Promise<{ rowCount: number; rows: any[] }> {
    return this.emit('raw', {
      sql,
      values,
    });
  }

  select(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<any[]>;
  select(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<any[]>;
  select(schema: MigrationSchema, table: string, query: RelationalSelectQuery): Promise<any[]> {
    return this.emit('select', {
      migrationId: schema.migrationId,
      table,
      where: query.filter,
      orderBy: query.orderBy,
      limit: query.limit,
      skip: query.skip,
    });
  }

  update(schema: MigrationSchema, table: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  update(schema: MigrationSchema, table: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }>;
  update(schema: MigrationSchema, table: string, data: any, filter: OrRootFilter<any> | AndRootFilter<any> | any | null): Promise<{ affectedRows: number }> {
    return this.emit('update', {migrationId: schema.migrationId, table, set: data, where: filter});
  }
}

export class SocketTRelationalDataAdapter extends SocketRelationalDataAdapter implements RelationalDataAdapter {
  kind: 'dataAdapter' = 'dataAdapter';

  get sqlBuilder(): RelationalSqlBuilder {
    throw new Error('not implemented');
  }

  transaction(action: (adapter: RelationalTransactionDataAdapter) => Promise<any>): Promise<void> {

  }
}
