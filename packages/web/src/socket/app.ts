import * as http from 'http';
import * as socketIo from 'socket.io';
import {SocketRawEvent} from './events/socket-raw-event';
import {AppOptions} from '../app-options';
import {ContextManager} from '../context-manager';
import {SocketBeginTransaction} from './events/socket-begin-transaction';
import {SocketRollbackTransaction} from './events/socket-rollback-transaction';
import {SocketCommitTransaction} from './events/socket-commit-transaction';
import * as debug from 'debug';
import {SocketAuthEvent} from './events/socket-auth-event';
import {ContextUser} from '@daita/core/dist/auth';

function handle<T>(
  socket: socketIo.Socket,
  event: string,
  action: (data: T) => Promise<any>,
) {
  socket.on(event, async data => {
    debug('daita:web:socket')('received event ' + event, data);
    try {
      const result = await action(data);
      socket.emit(event, {cid: data.cid, result});
    } catch (e) {
      socket.emit('err', {cid: data.cid, err: e.message});
    }
  });
}

export function createSocketApp(
  server: http.Server,
  options: AppOptions,
): http.Server {
  const io = socketIo(server);

  io.on('connection', socket => {
    let user: ContextUser = {anonymous: true};
    let userExpireTimeout: NodeJS.Timeout | null = null;
    const manager = new ContextManager(options, socket);

    handle<SocketAuthEvent>(socket, 'auth', async data => {
      if (options.auth) {
        if (data.kind === 'token') {
          const result = await options.auth.tokenProvider.verify(data.token);
          user = await options.auth.userProvider.get(result);
          if (result.exp) {
            if (userExpireTimeout) {
              clearTimeout(userExpireTimeout);
            }
            const now = Math.floor(new Date().getTime() / 1000);
            const timeExpired = (result.exp - now) * 1000;
            userExpireTimeout = setTimeout(() => {
              if (user) {
                debug('daita:web:socket')(`user ${user} expired`);
              }
              user = {anonymous: true};
            }, timeExpired);
          }
          return {};
        } else if (data.kind === 'userpass') {
          throw new Error('no userpass auth configured');
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

    handle<SocketRawEvent>(socket, 'raw', data => {
      return manager.raw(data, user);
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
