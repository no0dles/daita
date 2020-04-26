import * as client from 'socket.io-client';
import * as debug from 'debug';
import {SocketRelationalDataAdapter} from './socket-relational-data-adapter';
import { RelationalDataAdapter, RelationalTransactionAdapter } from "@daita/relational";
import { AuthProvider } from "../../http/src/auth/auth-provider";
import { Defer } from "@daita/common";

export class SocketRelationalAdapter extends SocketRelationalDataAdapter
  implements RelationalTransactionAdapter {

  private transactions: { [key: string]: Defer<void> } = {};

  constructor(baseUrl: string, options?: { auth?: AuthProvider }) {
    super({}, client.connect(baseUrl), {});

    if (options && options.auth) {
      if (options.auth.kind === 'userpass') {
        this.emit('auth', {
          kind: 'userpass',
          username: options.auth.username,
          password: options.auth.password,
        }).then(res => {
          this.authDefer.resolve();
        });
      } else if (options.auth.kind === 'token') {
        options.auth.getToken().then(token => {
          this.emit('auth', {kind: 'token', token}).then(res => {
            this.authDefer.resolve(); //TODO refresh
          });
        });
      } else {
        this.authDefer.resolve();
      }
    }

    const events = ['raw', 'beginTrx', 'commitTrx', 'rollbackTrx', 'auth'];
    for (const event of events) {
      this.socket.on(event, (data: any) => {
        const defer = this.defers[data.cid];
        if (defer) {
          defer.resolve(data.result);
          delete this.defers[data.cid];
        } else {
          debug('daita:socket:adapter')(`no defer found for cid: ${data.cid}`);
        }
      });
    }
    this.socket.on('err', (data: any) => {
      this.defers[data.cid].reject(new Error(data.err));
      delete this.defers[data.cid];
    });
    this.socket.on('trxTimeout', (data: any) => {
      this.transactions[data.tid].reject(new Error('transaction timeout'));
      delete this.transactions[data.tid];
    });
  }

  close() {
    this.socket.close();
  }

  async transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    const tid = this.idGenerator.next();
    await this.emit('beginTrx', {
      tid,
    });
    try {
      const timeoutDefer = new Defer<void>();
      this.transactions[tid] = timeoutDefer;
      const execution = action(new SocketRelationalDataAdapter(this.defers, this.socket, {tid}));
      await Promise.race([execution, timeoutDefer.promise]);
      if (timeoutDefer.isRejected) {
        throw timeoutDefer.rejectedError;
      }
      await this.emit('commitTrx', {
        tid,
      });
      return execution;
    } catch (e) {
      debug('daita:socket:adapter')(e.message);
      if (e.message === 'transaction timeout') {
        throw e;
      }

      if (e.message === 'could not find transaction for ' + tid) {
        throw e;
      }

      this.emit('rollbackTrx', {
        tid,
      });
      throw e;
    } finally {
      delete this.transactions[tid];
    }
  }
}
