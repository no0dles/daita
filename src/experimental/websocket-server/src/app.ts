import * as http from 'http';
import * as socketIo from 'socket.io';
import {SocketRawEvent} from './events/socket-raw-event';
import {SocketBeginTransaction} from './events/socket-begin-transaction';
import {SocketRollbackTransaction} from './events/socket-rollback-transaction';
import {SocketCommitTransaction} from './events/socket-commit-transaction';
import {SocketAuthEvent, SocketTokenAuthEvent} from './events/socket-auth-event';
import {SqlPermissions} from '@daita/relational';
import {
  AppDataOptions,
  AppOptions,
  AppTransactionOptions,
  ContextManager,
  isAppTransactionOptions, isTokenProvider, TransactionContextManager,
} from '@daita/http-server-common';
import {failNever} from '@daita/common';
import {SocketExecTransactionEvent} from './events/socket-exec-transaction';

export function createHandler(socket: socketIo.Socket, options: AppOptions): WebsocketHandler {
  if (isAppTransactionOptions(options)) {
    return new WebsocketTransactionHandler(socket, options);
  } else {
    return new WebsocketDataHandler(socket, options);
  }
}

export abstract class WebsocketHandler {
  protected permissions: SqlPermissions | null = null;
  private userExpireTimeout: NodeJS.Timeout | null = null;

  constructor(private socket: socketIo.Socket) {
  }

  abstract init(): void;

  protected handle<T>(
    event: string,
    action: (data: T) => Promise<any>,
  ) {
    this.socket.on(event, async data => {
      try {
        const result = await action(data);
        this.socket.emit(event, {cid: data.cid, result});
      } catch (e) {
        this.socket.emit('err', {cid: data.cid, err: e.message});
      }
    });
  }

  setPermissionExpire(expireIn: number) {
    if (this.userExpireTimeout) {
      clearTimeout(this.userExpireTimeout);
    }
    this.userExpireTimeout = setTimeout(() => {
      this.permissions = null;
    }, expireIn);
  }

  close() {
    if (this.userExpireTimeout) {
      clearTimeout(this.userExpireTimeout);
    }
  }
}

export class WebsocketDataHandler extends WebsocketHandler {

  constructor(socket: socketIo.Socket,
              protected options: AppDataOptions) {
    super(socket);
  }

  init(): void {
    this.handle<SocketRawEvent>('exec', async data => {
      const context = new ContextManager(this.options.dataAdapter, this.permissions);
      return await context.exec(data.sql, !!this.options.authProvider);
    });

    const authProvider = this.options.authProvider;
    if (authProvider) {
      if (isTokenProvider(authProvider)) {
        this.handle<SocketTokenAuthEvent>('tokenAuth', async data => {
          const auth = await authProvider.verify(data.token);
          this.permissions = auth.permissions ?? null;
          if (auth.expireIn) {
            this.setPermissionExpire(auth.expireIn);
          }
        });
      } else {
        failNever(authProvider, 'unknown auth provider');
      }
    }
  }
}

export class WebsocketTransactionHandler extends WebsocketDataHandler {
  private transactionManager: TransactionContextManager;

  constructor(socket: socketIo.Socket,
              options: AppTransactionOptions) {
    super(socket, options);
    this.transactionManager = new TransactionContextManager(options);
  }

  init(): void {
    super.init();
    this.handle<SocketBeginTransaction>('beginTrx', async data => {
      await this.transactionManager.create(data.tid, this.permissions);
    });
    this.handle<SocketRollbackTransaction>('rollbackTrx', async data => {
      const manager = await this.transactionManager.get(data.tid);
      await manager.rollback();
    });
    this.handle<SocketExecTransactionEvent>('execTrx', async data => {
      const manager = await this.transactionManager.get(data.tid);
      return await manager.exec(data.sql, !!this.options.authProvider);
    });
    this.handle<SocketCommitTransaction>('commitTrx', async data => {
      const manager = await this.transactionManager.get(data.tid);
      await manager.commit();
    });
  }
}

export function createWebsocketServer(
  options: AppOptions,
): http.Server {
  const server = http.createServer();
  const io = socketIo(server);

  io.on('connection', socket => {
    const handler = createHandler(socket, options);

    socket.on('disconnect', () => {
      handler.close();
    });
  });

  return server;
}
