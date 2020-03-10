import {
  AndRootFilter,
  Defer,
  OrRootFilter,
  RelationalDataAdapter,
  RelationalSelectQuery,
  SqlDmlQuery,
  SqlQuery,
} from '@daita/core';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';
import * as debug from 'debug';
import {IdGenerator} from '../id-generator';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';

export class SocketRelationalDataAdapter implements RelationalDataAdapter {
  protected idGenerator: IdGenerator;

  constructor(protected defers: { [key: string]: Defer<any> },
              protected socket: any,
              private globalEmitValue: any) {
    this.idGenerator = new IdGenerator();
  }

  isKind(kind: 'data' | 'migration' | 'transaction'): boolean {
    return kind === 'data';
  }

  protected emit<T>(event: string, data: T) {
    const cid = this.idGenerator.next();
    const defer = new Defer<any>();
    this.defers[cid] = defer;
    debug('web:socket')('emit event ' + event + ' with cid ' + cid);
    this.socket.emit(event, {...data, cid, ...this.globalEmitValue});
    return defer.promise;
  }

  count(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<number> {
    return this.emit('count', {
      migrationId: schema.migrationId,
      table,
      where: query.filter,
    });
  }

  delete(
    schema: MigrationSchema,
    table: string,
    filter: OrRootFilter<any> | AndRootFilter<any> | any | null,
  ): Promise<{ affectedRows: number }> {
    return this.emit('delete', {
      migrationId: schema.migrationId,
      table,
      where: filter,
    });
  }

  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void> {
    return this.emit('insert', {
      migrationId: schema.migrationId,
      table,
      data,
    });
  }

  raw(sql: string | SqlQuery | SqlDmlQuery, values?: any[]): Promise<RelationalRawResult> {
    return this.emit('raw', {
      sql,
      values,
    });
  }

  select(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<any[]> {
    return this.emit('select', {
      migrationId: schema.migrationId,
      table,
      where: query.filter,
      orderBy: query.orderBy,
      limit: query.limit,
      skip: query.skip,
    });
  }

  update(
    schema: MigrationSchema,
    table: string,
    data: any,
    filter: OrRootFilter<any> | AndRootFilter<any> | any | null,
  ): Promise<{ affectedRows: number }> {
    return this.emit('update', {
      migrationId: schema.migrationId,
      table,
      set: data,
      where: filter,
    });
  }
}