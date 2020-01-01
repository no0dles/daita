export type PrimitivePartial<T> = {
  [P in keyof T]?: T[P] extends number
    ? number
    : T[P] extends string
      ? string
      : T[P] extends boolean
        ? boolean
        : T[P] extends Date
          ? Date
          : never;
};
