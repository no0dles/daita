import {AndRootFilter, Defer, OrRootFilter, RelationalSelectQuery} from '@daita/core';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';

export class BaseSocketDataAdapter {
  protected defers: { [key: string]: Defer<any> } = {};

  constructor(protected socket: SocketIOClient.Socket, private globalEmitValue: any) {
  }

  protected emit<T>(event: string, data: T) {
    const cid = this.generateCid();
    const defer = new Defer<any>();
    this.defers[cid] = defer;
    console.log('emit event ' + event + ' with cid ' + cid);
    this.socket.emit(event, {...data, cid: cid, ...this.globalEmitValue});
    return defer.promise;
  }

  protected generateCid() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
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

  raw(sql: string, values: any[]): Promise<{ rowCount: number; rows: any[] }> {
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