export class RelationDoesNotExistsError extends Error {
  constructor(
    public sourceError: Error,
    public sourceSql: string,
    public sourceSqlValues: any[],
    public schema: string | undefined,
    public relation: string,
  ) {
    super(
      `Relation "${
        schema ? `${schema}.${relation}` : relation
      }" does not exists`,
    );
  }
}

export class DuplicateKeyError extends Error {
  constructor(
    public sourceError: Error,
    public sourceSql: string,
    public sourceSqlValues: any[],
    public schema: string | undefined,
    public table: string | undefined,
    public constraint: string | undefined,
    public keys: any,
  ) {
    super(`Duplicate key for ${constraint} (${JSON.stringify(keys)})`);
  }
}

export class UnknownError extends Error {
  constructor(
    public sourceError: Error,
    public sourceSql: string,
    public sourceSqlValues: any[],
  ) {
    super(sourceError.message);
  }
}

export type RelationalError =
  | RelationDoesNotExistsError
  | DuplicateKeyError
  | UnknownError;
