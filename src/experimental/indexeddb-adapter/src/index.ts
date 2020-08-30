import { RelationalDataAdapter, RelationalRawResult } from '@daita/relational';

export function open() {
  const DBOpenRequest = window.indexedDB.open("toDoList", 4);
}


// export class IndexedDBRelationalAdapter implements RelationalDataAdapter<any> {
//     execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
//         throw new Error("raw sql not supported for indexeddb");
//     }
//     exec(sql: any): Promise<RelationalRawResult> {
//         throw new Error("Method not implemented.");
//     }
//     supportsQuery(sql: any): boolean {
//         throw new Error("Method not implemented.");
//     }
//     close(): Promise<void> {
//         throw new Error("Method not implemented.");
//     }
// }
