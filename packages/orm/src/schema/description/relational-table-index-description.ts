import { RelationalTableDescription } from './relational-table-description';
import { RelationalTableFieldDescription } from './relational-table-field-description';

export class RelationalTableIndexDescription {
  constructor(public name: string,
              public table: RelationalTableDescription,
              public fields: RelationalTableFieldDescription[],
              public unique: boolean) {

  }
}
