import { isKind } from '@daita/common';

export interface CreateSchemaSql {
  createSchema: string;
  ifNotExists?: boolean;
}

export const isCreateSchemaSql = (val: any): val is CreateSchemaSql => isKind<CreateSchemaSql>(val, ['createSchema']);
