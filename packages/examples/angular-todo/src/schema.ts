import {RelationalSchema} from '@daita/core';
import {Todo} from './models/todo';
import {InitialMigration} from './migrations/202003121554-initial';

export const schema = new RelationalSchema();

schema.table(Todo);
schema.migration(InitialMigration);
