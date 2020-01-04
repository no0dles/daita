export interface SocketRawEvent {
  sql: string;
  values: any[];
  tid?: string;
}
