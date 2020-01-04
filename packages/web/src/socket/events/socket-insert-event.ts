export interface SocketInsertEvent {
  migrationId: string;
  table: string;
  data: any[] | any;
  tid?: string;
}
