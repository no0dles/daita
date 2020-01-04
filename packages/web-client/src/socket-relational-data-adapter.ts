import {
  Defer, RelationalDataAdapter,
  RelationalTransactionDataAdapter,
} from '@daita/core';
import * as client from 'socket.io-client';
import {RelationalSqlBuilder} from '@daita/core/dist/adapter/relational-sql-builder';
import {BaseSocketDataAdapter} from './base-socket-data-adapter';
import {SocketRelationalTransactionDataAdapter} from './socket-relational-transaction-data-adapter';

export class SocketRelationalDataAdapter extends BaseSocketDataAdapter
  implements RelationalDataAdapter {

  private transactions: { [key: string]: Defer<void> } = {};

  kind: 'dataAdapter' = 'dataAdapter';

  constructor(private baseUrl: string) {
    super(client.connect(baseUrl), {});

    const events = ['insert', 'update', 'select', 'delete', 'raw', 'count', 'beginTrx', 'commitTrx', 'rollbackTrx'];
    for (const event of events) {
      this.socket.on(event, (data: any) => {
        this.defers[data.cid].resolve(data.result);
        delete this.defers[data.cid];
      });
    }
    this.socket.on('err', (data: any) => {
      this.defers[data.cid].reject(new Error(data.err));
      delete this.defers[data.cid];
    });
    this.socket.on('trxTimeout', (data: any) => {
      this.transactions[data.tid].reject(new Error('transaction timeout'));
      delete this.transactions[data.cid];
    });
  }

  get sqlBuilder(): RelationalSqlBuilder {
    throw new Error('not implemented');
  }

  close() {
    this.socket.close();
  }

  async transaction(action: (adapter: RelationalTransactionDataAdapter) => Promise<any>): Promise<void> {
    const tid = this.generateCid();
    await this.emit('beginTrx', {
      tid,
    });
    try {
      const timeoutDefer = new Defer<void>();
      this.transactions[tid] = timeoutDefer;
      const execution = action(new SocketRelationalTransactionDataAdapter(tid, this.socket));
      await Promise.race([execution, timeoutDefer.promise]);
      if (timeoutDefer.isRejected) {
        throw timeoutDefer.rejectedError;
      }
      await this.emit('commitTrx', {
        tid,
      });
    } catch (e) {
      if (e.message === 'transaction timeout') {
        throw e;
      }

      await this.emit('rollbackTrx', {
        tid,
      });
    } finally {
      delete this.transactions[tid];
    }
  }
}
