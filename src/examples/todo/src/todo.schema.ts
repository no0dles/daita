import { RelationalSchema } from '@daita/orm';
import { Todo } from './models/todo.model';
import { InitialMigration } from './migrations/2021-00-01-150753-initial';

export const todoSchema = new RelationalSchema('todo');
todoSchema.table(Todo);
todoSchema.migration(InitialMigration);
