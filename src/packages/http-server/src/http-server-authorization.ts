import { MigrationTree, OrmRelationalSchema } from '@daita/orm';
import { Rule } from '@daita/relational';

export interface HttpServerAuthorization {
  providers?: HttpServerAuthorizationProvider[];
  tokenEndpoints?: HttpServerAuthorizationTokenEndpoint[];
  cors?: string[];
  rules: { id: string; rule: Rule }[] | 'disabled' | MigrationTree | { schemaName: string } | OrmRelationalSchema;
}

export interface HttpServerAuthorizationTokenEndpoint {
  issuer: string;
  uri: string;
}

export interface HttpServerAuthorizationProvider {
  issuer: string;
  uri: string;
}
