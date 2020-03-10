import {isKind} from '../utils/is-kind';

export interface SqlMaxFunction {
  max: { schema?: string, table?: string, field: string },
}

export const isSqlMaxFunction = (val: any): val is SqlMaxFunction => isKind<SqlMaxFunction>(val, ['max']);