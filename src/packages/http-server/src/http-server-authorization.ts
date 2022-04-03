import { MigrationTree, OrmRelationalSchema, OrmSql } from '@daita/orm';
import { Rule } from '@daita/relational';

export interface HttpServerAuthorization {
  providers?: HttpServerAuthorizationProvider[];
  tokenEndpoints?: HttpServerAuthorizationTokenEndpoint[];
  cors?: string[];
  rules:
    | { id: string; rule: Rule }[]
    | 'disabled'
    | MigrationTree<OrmSql>
    | { schemaName: string }
    | OrmRelationalSchema<OrmSql>;
}

export interface HttpServerAuthorizationTokenEndpoint {
  issuer: string;
  uri: string;
}

export interface HttpServerAuthorizationProvider {
  issuer: string;
  uri: string;
}
