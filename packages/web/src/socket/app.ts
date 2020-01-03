import * as http from 'http';
import * as socket from 'socket.io';
import { SocketUpdateEvent } from './events/socket-update-event';
import { SocketInsertEvent } from './events/socket-insert-event';
import { SocketSelectEvent } from './events/socket-select-event';
import { SocketRawEvent } from './events/socket-raw-event';
import {
  count,
  getContext,
  insert,
  remove,
  select,
  update,
} from '../functions';
import { SocketDeleteEvent } from './events/socket-delete-event';
import { SocketCountEvent } from './events/socket-count-event';
import { AppOptions } from '../app-options';

function handle<T>(
  socket: socket.Socket,
  event: string,
  action: (data: T) => Promise<any>,
) {
  socket.on(event, async data => {
    console.log('received event ' + event, data);
    try {
      const result = await action(data);
      socket.emit(event, { cid: data.cid, result: result });
    } catch (e) {
      socket.emit('err', { cid: data.cid, err: e.message });
    }
  });
}

export function createSocketApp(
  server: http.Server,
  options: AppOptions,
): http.Server {
  const io = socket(server);

  io.on('connection', socket => {
    handle<SocketInsertEvent>(socket, 'insert', async data => {
      const context = getContext(options, data.migrationId);
      return insert({ name: data.table }, context, data);
    });

    handle<SocketUpdateEvent>(socket, 'update', data => {
      const context = getContext(options, data.migrationId);
      return update({ name: data.table }, context, data);
    });

    handle<SocketDeleteEvent>(socket, 'delete', data => {
      const context = getContext(options, data.migrationId);
      return remove({ name: data.table }, context, data);
    });

    handle<SocketSelectEvent>(socket, 'select', data => {
      const context = getContext(options, data.migrationId);
      return select({ name: data.table }, context, data);
    });

    handle<SocketCountEvent>(socket, 'count', data => {
      const context = getContext(options, data.migrationId);
      return count({ name: data.table }, context, data);
    });

    handle<SocketRawEvent>(socket, 'raw', data => {
      return options.dataAdapter.raw(data.sql, data.values);
    });

    socket.on('disconnect', () => {
      //io.emit('user disconnected');
    });
  });

  return server;
}
