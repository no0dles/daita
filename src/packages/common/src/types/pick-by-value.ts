export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp ? P : never };
