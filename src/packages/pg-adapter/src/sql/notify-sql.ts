import { isKind } from '@daita/common';

export interface PostgresNotifySql {
  notify: string;
  payload?: string;
}

export const isNotifySql = (val: any): val is PostgresNotifySql => isKind<PostgresNotifySql>(val, ['notify']);
