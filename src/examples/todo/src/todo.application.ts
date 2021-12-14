import { IwentApplication } from '@daita/iwent';
import { todoModule } from './todo.module';
import { todoSchema } from './todo.schema';

export const todoApplication = new IwentApplication('todo', todoSchema);
todoApplication.module(todoModule);
