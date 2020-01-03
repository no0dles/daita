export interface SocketSelectEvent {
  migrationId: string;
  table: string;
  where?: any;
  orderBy?: any[];
  limit?: number;
  skip?: number;
}
