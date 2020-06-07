export interface NotInDescription<T> {
  notIn: {field: T; values: T[]}
}
