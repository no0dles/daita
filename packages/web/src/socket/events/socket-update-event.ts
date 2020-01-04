export interface SocketUpdateEvent {
  migrationId: string;
  table: string;
  set: any;
  where: any;
  tid?: string;
}
