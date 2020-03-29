import {RelationalInsertContext} from './relational-insert-context';
import {DefaultConstructable} from '../constructable';
import {RelationalSelectContext} from './relational-select-context';
import {RelationalUpdateContext} from './relational-update-context';
import {RelationalDeleteContext} from './relational-delete-context';

export interface RelationalDataContext {
  insert<T>(type: DefaultConstructable<T>): RelationalInsertContext<T>;

  select<T>(type: DefaultConstructable<T>): RelationalSelectContext<T>;

  update<T>(type: DefaultConstructable<T>): RelationalUpdateContext<T>;

  delete<T>(type: DefaultConstructable<T>): RelationalDeleteContext<T>;
}
