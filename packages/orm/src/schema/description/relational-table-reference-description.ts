import {RelationalTableReferenceKeyDescription} from './relational-table-reference-key-description';
import {RelationalTableDescription} from './relational-table-description';

export class RelationalTableReferenceDescription {
  required: boolean;

  constructor(public name: string,
              public table: RelationalTableDescription,
              public keys: RelationalTableReferenceKeyDescription[]) {
    this.required = !this.keys.some(k => !k.field.required);
  }
}
