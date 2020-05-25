import { SqlFieldType } from "@daita/relational";

export type PostgresFieldType = SqlFieldType
  | "string[]"
  | "number[]"
  | "date[]"
  | "boolean[]";
