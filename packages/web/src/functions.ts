import {TableInformation} from '@daita/core/dist/context/table-information';
import {
  RelationalDataAdapter,
  RelationalSelectContext,
  RelationalTransactionContext,
} from '@daita/core';
import {SocketUpdateEvent} from './socket/events/socket-update-event';
import {SocketInsertEvent} from './socket/events/socket-insert-event';
import {SocketSelectEvent} from './socket/events/socket-select-event';
import {SocketDeleteEvent} from './socket/events/socket-delete-event';
import {SocketCountEvent} from './socket/events/socket-count-event';
import {ContextUser} from '@daita/core/dist/auth';
import {MigrationSchema} from '@daita/core/dist/schema/migration-schema';

export const insert = async (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketInsertEvent,
) => {
  if (body.data instanceof Array) {
    await context
      .insert(type)
      .values(...body.data);
  } else {
    await context
      .insert(type)
      .value(body.data);
  }
  return null;
};

export const remove = (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketDeleteEvent,
) => {
  return context
    .delete(type)
    .where(body.where);
};

export const update = (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketUpdateEvent,
) => {
  return context
    .update(type)
    .where(body.where)
    .set(body.set);
};

export const count = async (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketCountEvent,
) => {
  let query = context.select(type as any);

  if (body.where) {
    query = query.where(body.where);
  }

  return await query.count();
};

export const select = async (
  type: TableInformation<any>,
  dataAdapter: RelationalDataAdapter,
  schema: MigrationSchema,
  body: SocketSelectEvent,
  user: ContextUser | null | undefined
) => {
  const context = new RelationalSelectContext<any>(
    dataAdapter, schema, type, {
      orderBy: body.orderBy ?? [],
      filter: body.where ?? null,
      limit: body.limit ?? null,
      include: body.include ?? [],
      skip: body.skip ?? null,
    }, user ?? null);
  return await context;
};