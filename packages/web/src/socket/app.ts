import * as http from 'http';
import * as socket from 'socket.io';
import {SocketUpdateEvent} from './events/socket-update-event';
import {SocketInsertEvent} from './events/socket-insert-event';
import {SocketSelectEvent} from './events/socket-select-event';
import {SocketRawEvent} from './events/socket-raw-event';
import {count, insert, remove, select, update} from '../functions';
import {SocketDeleteEvent} from './events/socket-delete-event';
import {SocketCountEvent} from './events/socket-count-event';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';
import {SocketBeginTransaction} from './events/socket-begin-transaction';
import {SocketRollbackTransaction} from './events/socket-rollback-transaction';
import {SocketCommitTransaction} from './events/socket-commit-transaction';
import * as debug from 'debug';
import {SocketAuthEvent} from './events/socket-auth-event';
import {ContextUser} from '@daita/core/dist/auth';

function handle<T>(
  socket: socket.Socket,
  event: string,
  action: (data: T) => PromiseLike<any>,
) {
  socket.on(event, async data => {
    debug('daita:web:socket')('received event ' + event, data);
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
    let user: ContextUser | null = null;
    let userExpireTimeout: NodeJS.Timeout | null = null;
    const manager = new ContextManager(options, socket);

    handle<SocketAuthEvent>(socket, 'auth', async data => {
      if (options.auth) {
        const result = await options.auth.tokenProvider.verify(data.token);
        user = await options.auth.userProvider.get(result);
        if (result.exp) {
          if (userExpireTimeout) {
            clearTimeout(userExpireTimeout);
          }
          userExpireTimeout = setTimeout(() => {
            if (user) {
              debug('daita:web:socket')(`user ${user.username} expired`);
            }
            user = null;
          }, result.exp - new Date().getTime());
        }
      } else {
        throw new Error('no auth configured');
      }
    });

    handle<SocketBeginTransaction>(socket, 'beginTrx', async data => {
      await manager.beginTransaction(data.tid, user);
    });

    handle<SocketRollbackTransaction>(socket, 'rollbackTrx', async data => {
      await manager.rollbackTransaction(data.tid);
    });

    handle<SocketCommitTransaction>(socket, 'commitTrx', async data => {
      await manager.commitTransaction(data.tid);
    });

    handle<SocketInsertEvent>(socket, 'insert', async data => {
      const context = manager.getContext({migrationId: data.migrationId, user: user, transactionId: data.tid});
      return insert({name: data.table}, context, data);
    });

    handle<SocketUpdateEvent>(socket, 'update', data => {
      const context = manager.getContext({migrationId: data.migrationId, user: user, transactionId: data.tid});
      return update({name: data.table}, context, data);
    });

    handle<SocketDeleteEvent>(socket, 'delete', data => {
      const context = manager.getContext({migrationId: data.migrationId, user: user, transactionId: data.tid});
      return remove({name: data.table}, context, data);
    });

    handle<SocketSelectEvent>(socket, 'select', data => {
      const context = manager.getContext({migrationId: data.migrationId, user: user, transactionId: data.tid});
      return select({name: data.table}, context, data);
    });

    handle<SocketCountEvent>(socket, 'count', data => {
      const context = manager.getContext({migrationId: data.migrationId, user: user, transactionId: data.tid});
      return count({name: data.table}, context, data);
    });

    handle<SocketRawEvent>(socket, 'raw', data => {
      const context = manager.getContext({user: user, transactionId: data.tid});
      return context.raw(data.sql, data.values);
    });

    socket.on('disconnect', () => {
      manager.close();
      if (userExpireTimeout) {
        clearTimeout(userExpireTimeout);
      }
    });
  });

  return server;
}
