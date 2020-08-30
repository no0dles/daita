import { RelationalSchemaDescription } from './relational-schema-description';
import { SelectSql } from '../../../relational/sql';

export class RelationalViewDescription {
  constructor(
    private schemaDescription: RelationalSchemaDescription,
    public query: SelectSql<any>,
    public key: string,
    public name: string,
    public schema?: string,
  ) {}
}
