import { IwentModule } from '../../packages/iwent/iwent-module';
import { CreateTodoEvent } from './events/create-todo.event';
import { CreateTodoHandler } from './handlers/create-todo.handler';
import { CompleteTodoEvent } from './events/complete-todo.event';
import { CompleteTodoHandler } from './handlers/complete-todo.handler';
import { RemoveTodoEvent } from './events/remove-todo.event';
import { RemoveTodoHandler } from './handlers/remove-todo.handler';

export const todoModule = new IwentModule('todo');
todoModule.handle(CreateTodoEvent, CreateTodoHandler);
todoModule.handle(CompleteTodoEvent, CompleteTodoHandler);
todoModule.handle(RemoveTodoEvent, RemoveTodoHandler);
