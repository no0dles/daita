import {BaseSocketDataAdapter} from './base-socket-data-adapter';
import {RelationalTransactionDataAdapter} from '@daita/core';
import Socket = SocketIOClient.Socket;

export class SocketRelationalTransactionDataAdapter extends BaseSocketDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private tid: string,
              socket: Socket) {
    super(socket, {tid: tid});
  }
}