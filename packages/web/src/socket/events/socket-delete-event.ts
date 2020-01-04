export interface SocketDeleteEvent {
  migrationId: string;
  table: string;
  where: any;
  tid?: string;
}
