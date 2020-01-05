import {BaseSocketDataAdapter} from './base-socket-data-adapter';
import {Defer, RelationalTransactionDataAdapter} from '@daita/core';
import Socket = SocketIOClient.Socket;

export class SocketRelationalTransactionDataAdapter extends BaseSocketDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private tid: string,
              defers: { [key: string]: Defer<any> },
              socket: Socket) {
    super(defers, socket, {tid: tid});
  }
}