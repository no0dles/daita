import { RelationalSchemaDescription } from './relational-schema-description';
import { SelectSql } from '@daita/relational';

export class RelationalViewDescription {

  constructor(private schemaDescription: RelationalSchemaDescription,
              public query: SelectSql<any>,
              public key: string,
              public name: string,
              public schema?: string) {

  }
}
