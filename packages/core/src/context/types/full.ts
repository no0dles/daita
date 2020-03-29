export type Full<T> = T extends string ? string :
  T extends number ? number :
    T extends boolean ? boolean :
      T extends Date ? Date :
        T extends object ?
          { [P in keyof T]-?: Full<NonNullable<T[P]>> }
          : any;