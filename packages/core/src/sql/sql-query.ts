import {SqlSelect} from './sql-select';
import {SqlDelete} from './sql-delete';
import {SqlInsert} from './sql-insert';
import {SqlUpdate} from './sql-update';

export type SqlQuery = SqlSelect | SqlDelete | SqlUpdate | SqlInsert;