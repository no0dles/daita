import {SelectPermission} from './select-permission';

export interface BasePermission<T> {
  select?: SelectPermission<T> | boolean;
  delete?: boolean;
  insert?: boolean;
  update?: boolean;
}