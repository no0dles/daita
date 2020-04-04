import {RelationalTableReferenceKeyDescription} from './relational-table-reference-key-description';
import {RelationalTableDescription} from './relational-table-description';

export class RelationalTableReferenceDescription {
  constructor(public name: string,
              public table: RelationalTableDescription,
              public keys: RelationalTableReferenceKeyDescription[]) {
  }
}
