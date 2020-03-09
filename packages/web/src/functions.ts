import {TableInformation} from '@daita/core/dist/context/table-information';
import {
  RelationalTransactionContext,
} from '@daita/core';
import {SocketUpdateEvent} from './socket/events/socket-update-event';
import {SocketInsertEvent} from './socket/events/socket-insert-event';
import {SocketSelectEvent} from './socket/events/socket-select-event';
import {SocketDeleteEvent} from './socket/events/socket-delete-event';
import {SocketCountEvent} from './socket/events/socket-count-event';
import {RelationalSelectContextOrdered} from '@daita/core/dist/context/relational-select-context';

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
  context: RelationalTransactionContext,
  body: SocketSelectEvent,
) => {
  let query = context.select(type as any);

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
      (<any>query).user,
    );
    return await orderedQuery;
  }

  return await query;
};