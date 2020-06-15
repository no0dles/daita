import { RelationalDataAdapter, RelationalRawResult, SqlDmlQuery, SqlQuery } from "@daita/relational";
import { Defer } from "@daita/common";


export class SocketRelationalDataAdapter implements RelationalDataAdapter {
  protected authDefer = new Defer();
  protected idGenerator: IdGenerator;

  constructor(protected defers: { [key: string]: Defer<any> },
              protected socket: SocketIOClient.Socket,
              private globalEmitValue: any) {
    this.idGenerator = new IdGenerator();
    if (globalEmitValue.tid) {
      this.authDefer.resolve();
    }
  }

  protected async emit<T>(event: string, data: T) {
    const cid = this.idGenerator.next();
    const defer = new Defer<any>();
    if (event !== 'auth') {
      await this.authDefer.promise;
    }
    this.defers[cid] = defer;
    this.socket.emit(event, {...data, cid, ...this.globalEmitValue});
    return defer.promise;
  }

  raw(sql: string | SqlQuery | SqlDmlQuery, values?: any[]): Promise<RelationalRawResult> {
    return this.emit('raw', {
      sql,
      values,
    });
  }
}
