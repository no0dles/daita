import * as http from 'http';
import * as socket from 'socket.io';
import {SocketUpdateEvent} from './events/socket-update-event';
import {SocketInsertEvent} from './events/socket-insert-event';
import {SocketSelectEvent} from './events/socket-select-event';
import {SocketRawEvent} from './events/socket-raw-event';
import {count, insert, raw, remove, select, update} from '../functions';
import {SocketDeleteEvent} from './events/socket-delete-event';
import {SocketCountEvent} from './events/socket-count-event';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';
import {SocketBeginTransaction} from './events/socket-begin-transaction';
import {SocketRollbackTransaction} from './events/socket-rollback-transaction';
import {SocketCommitTransaction} from './events/socket-commit-transaction';

function handle<T>(
  socket: socket.Socket,
  event: string,
  action: (data: T) => Promise<any>,
) {
  socket.on(event, async data => {
    console.log('received event ' + event, data);
    try {
      const result = await action(data);
      socket.emit(event, {cid: data.cid, result: result});
    } catch (e) {
      socket.emit('err', {cid: data.cid, err: e.message});
    }
  });
}

export function createSocketApp(
  server: http.Server,
  options: AppOptions,
): http.Server {
  const io = socket(server);

  io.on('connection', socket => {
    const manager = new ContextManager(options, socket);

    handle<SocketBeginTransaction>(socket, 'beginTrx', async data => {
      await manager.beginTransaction(data.tid);
    });

    handle<SocketRollbackTransaction>(socket, 'rollbackTrx', async data => {
      await manager.rollbackTransaction(data.tid);
    });

    handle<SocketCommitTransaction>(socket, 'commitTrx', async data => {
      await manager.commitTransaction(data.tid);
    });

    handle<SocketInsertEvent>(socket, 'insert', async data => {
      const context = manager.getContext(data.migrationId, data.tid);
      return insert({name: data.table}, context, data);
    });

    handle<SocketUpdateEvent>(socket, 'update', data => {
      const context = manager.getContext(data.migrationId, data.tid);
      return update({name: data.table}, context, data);
    });

    handle<SocketDeleteEvent>(socket, 'delete', data => {
      const context = manager.getContext(data.migrationId, data.tid);
      return remove({name: data.table}, context, data);
    });

    handle<SocketSelectEvent>(socket, 'select', data => {
      const context = manager.getContext(data.migrationId, data.tid);
      return select({name: data.table}, context, data);
    });

    handle<SocketCountEvent>(socket, 'count', data => {
      const context = manager.getContext(data.migrationId, data.tid);
      return count({name: data.table}, context, data);
    });

    handle<SocketRawEvent>(socket, 'raw', data => {
      const dataAdapter = manager.getDataAdapter(data.tid);
      return raw(dataAdapter, data);
    });

    socket.on('disconnect', () => {
      manager.close();
    });
  });

  return server;
}
