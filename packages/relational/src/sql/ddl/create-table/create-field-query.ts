export interface SqlCreateFieldQuery<TFieldType> {
  name: string;
  type: TFieldType;
  notNull?: boolean;
  primaryKey?: boolean;
}
