export interface RelationalRawResult {
  rowCount: number;
  rows: any[];
}

// export const isRelationalRawResult = (val: any): val is RelationalRawResult =>
//   isKind<RelationalRawResult>(val, ['rowCount', 'rows']);
