export interface RelationalAdapter {
  isKind(kind: 'data' | 'migration' | 'transaction'): boolean;
}