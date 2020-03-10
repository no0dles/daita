import {isKind} from '../utils/is-kind';

export interface SqlMinFunction {
  min: { schema?: string, table?: string, field: string },
}

export const isSqlMinFunction = (val: any): val is SqlMinFunction => isKind<SqlMinFunction>(val, ['min']);