import {RelationalTableFieldDescription} from './relational-table-field-description';

export interface RelationalTableReferenceKeyDescription {
  foreignField: RelationalTableFieldDescription;
  field: RelationalTableFieldDescription;
}
