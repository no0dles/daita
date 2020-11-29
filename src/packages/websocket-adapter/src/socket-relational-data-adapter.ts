// import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
// import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
// import { Defer } from '../../common/utils/defer';
// import { randomString } from '../../common/utils/random-string';
// import { Sql } from '../../relational/sql/sql';
//
// export class SocketRelationalDataAdapter implements RelationalDataAdapter {
//   protected authDefer = new Defer();
//
//   constructor(
//     protected defers: { [key: string]: Defer<any> },
//     protected socket: SocketIOClient.Socket,
//     private globalEmitValue: any,
//   ) {
//     if (globalEmitValue.tid) {
//       this.authDefer.resolve();
//     }
//   }
//
//   protected async emit<T>(event: string, data: T) {
//     const cid = randomString(20);
//     const defer = new Defer<any>();
//     if (event !== 'auth') {
//       await this.authDefer.promise;
//     }
//     this.defers[cid] = defer;
//     this.socket.emit(event, { ...data, cid, ...this.globalEmitValue });
//     return defer.promise;
//   }
//
//   raw(sql: any, values?: any[]): Promise<RelationalRawResult> {
//     return this.emit('raw', {
//       sql,
//       values,
//     });
//   }
//
//   async close(): Promise<void> {
//     this.socket.close();
//   }
//
//   exec(sql: Sql<any>): Promise<RelationalRawResult> {
//     return Promise.resolve(undefined);
//   }
//
//   execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
//     return Promise.resolve(undefined);
//   }
//
//   supportsQuery<S>(sql: S): this is RelationalDataAdapter<Sql<any> | S> {
//     return undefined;
//   }
// }
