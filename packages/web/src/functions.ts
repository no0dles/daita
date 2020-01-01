import {TableInformation} from '@daita/core/dist/context/table-information';
import {RelationalContext, RelationalDataAdapter} from '@daita/core';
import {SocketUpdateEvent} from './socket/events/socket-update-event';
import {SocketInsertEvent} from './socket/events/socket-insert-event';
import {SocketSelectEvent} from './socket/events/socket-select-event';
import {SocketRawEvent} from './socket/events/socket-raw-event';
import {AppMigrationTreeOptions, AppOptions, AppSchemaOptions} from './app-options';
import {getMigrationSchema} from '@daita/core/dist/schema/migration-schema-builder';
import {SocketDeleteEvent} from './socket/events/socket-delete-event';
import {SocketCountEvent} from './socket/events/socket-count-event';

export const insert = async (type: TableInformation<any>, context: RelationalContext, body: SocketInsertEvent) => {
  if (body.data instanceof Array) {
    await context
      .insert(type)
      .values(...body.data)
      .exec();
  } else {
    await context
      .insert(type)
      .value(body.data)
      .exec();
  }
  return null;
};

export const remove = (type: TableInformation<any>, context: RelationalContext, body: SocketDeleteEvent) => {
  return context
    .delete(type)
    .where(body.where)
    .exec();
};

export const update = (type: TableInformation<any>, context: RelationalContext, body: SocketUpdateEvent) => {
  return context
    .update(type)
    .where(body.where)
    .set(body.set)
    .exec();
};

export const count = async (type: TableInformation<any>, context: RelationalContext, body: SocketCountEvent) => {
  let query = await context
    .select(type as any);

  if (body.where) {
    query = query.where(body.where);
  }

  return await query.execCount();
};

export const select = async (type: TableInformation<any>, context: RelationalContext, body: SocketSelectEvent) => {
  let query = await context
    .select(type as any);

  if (body.where) {
    query = query.where(body.where);
  }
  if (body.orderBy) {
    //query = query.orderBy(body.orderBy);
  }
  if (body.limit !== undefined && body.limit !== null) {
    query = query.limit(body.limit);
  }
  if (body.skip !== undefined && body.skip !== null) {
    query = query.skip(body.skip);
  }

  return await query.exec();
};

export const raw = (dataAdapter: RelationalDataAdapter, body: SocketRawEvent) => {
  return dataAdapter.raw(body.sql, body.values);
};

export function getContext(options: AppOptions, migrationId: string): RelationalContext {
  if ((<AppSchemaOptions>options).schema) {
    return (<AppSchemaOptions>options).schema.context(options.dataAdapter, migrationId);
  }

  if ((<AppMigrationTreeOptions>options).migrationTree) {
    const migrationTree = (<AppMigrationTreeOptions>options).migrationTree;
    const path = migrationTree.path(migrationId);
    return new RelationalContext(getMigrationSchema(path), (<AppMigrationTreeOptions>options).migrationTree, options.dataAdapter);
  }

  throw new Error('Could not create context');
}
