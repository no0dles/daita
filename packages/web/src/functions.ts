import {TableInformation} from '@daita/core/dist/context/table-information';
import {
  RelationalContext,
  RelationalDataAdapter,
  RelationalTransactionContext, RelationalTransactionDataAdapter,
} from '@daita/core';
import {SocketUpdateEvent} from './socket/events/socket-update-event';
import {SocketInsertEvent} from './socket/events/socket-insert-event';
import {SocketSelectEvent} from './socket/events/socket-select-event';
import {SocketRawEvent} from './socket/events/socket-raw-event';
import {
  AppMigrationTreeOptions,
  AppOptions,
  AppSchemaOptions,
} from './app-options';
import {getMigrationSchema} from '@daita/core/dist/schema/migration-schema-builder';
import {SocketDeleteEvent} from './socket/events/socket-delete-event';
import {SocketCountEvent} from './socket/events/socket-count-event';
import {RelationalSelectContextOrdered} from '@daita/core/dist/context/relational-select-context';
import {ContextUser} from '@daita/core/dist/auth';

export const insert = async (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketInsertEvent,
) => {
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

export const remove = (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketDeleteEvent,
) => {
  return context
    .delete(type)
    .where(body.where)
    .exec();
};

export const update = (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketUpdateEvent,
) => {
  return context
    .update(type)
    .where(body.where)
    .set(body.set)
    .exec();
};

export const count = async (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketCountEvent,
) => {
  let query = await context.select(type as any);

  if (body.where) {
    query = query.where(body.where);
  }

  return await query.execCount();
};

export const select = async (
  type: TableInformation<any>,
  context: RelationalTransactionContext,
  body: SocketSelectEvent,
) => {
  let query = await context.select(type as any);

  if (body.where) {
    query = query.where(body.where);
  }
  if (body.limit !== undefined && body.limit !== null) {
    query = query.limit(body.limit);
  }
  if (body.skip !== undefined && body.skip !== null) {
    query = query.skip(body.skip);
  }

  if (body.orderBy) {
    //todo
    const orderedQuery = new RelationalSelectContextOrdered<any>(
      (<any>query).dataAdapter,
      (<any>query).schema,
      (<any>query).type,
      {
        filter: (<any>query).state.filter,
        limit: (<any>query).state.limit,
        skip: (<any>query).state.skip,
        include: (<any>query).state.include,
        orderBy: [
          ...(<any>query).state.orderBy,
          ...body.orderBy,
        ],
      },
    );
    return await orderedQuery.exec();
  }

  return await query.exec();
};