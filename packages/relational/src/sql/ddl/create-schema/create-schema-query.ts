import { isKind } from '@daita/common';

export interface SqlCreateSchemaQuery {
  createSchema: string;
  ifNotExists?: boolean;
}

export const isSqlCreateSchemaQuery = (val: any): val is SqlCreateSchemaQuery => isKind<SqlCreateSchemaQuery>(val, ['createSchema']);
