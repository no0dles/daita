import {RelationalInsertContext} from './relational-insert-context';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';
import {TableInformation} from './table-information';

export interface RelationalDataContext {
  insert<T>(type: TableInformation<T>): RelationalInsertContext<T>;

  select<T>(type: TableInformation<T>): RelationalSelectContext<T>;

  update<T>(type: TableInformation<T>): RelationalUpdateContext<T>;

  delete<T>(type: TableInformation<T>): RelationalDeleteContext<T>;
}
