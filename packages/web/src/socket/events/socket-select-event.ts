export interface SocketSelectEvent {
  migrationId: string;
  table: string;
  where?: any;
  include?: { path: string[] }[];
  orderBy?: any[];
  limit?: number;
  skip?: number;
  tid?: string;
}
