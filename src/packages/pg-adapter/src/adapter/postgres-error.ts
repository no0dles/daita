export interface PostgresError extends Error {
  errno: number;
}

export const isPostgresError = (val: any): val is PostgresError =>
  !!val && val.errno !== undefined && val.errno !== null;
