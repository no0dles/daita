import { IwentHandler } from '../../../packages/iwent/iwent-handler';
import { CreateTodoEvent } from '../events/create-todo.event';
import { IwentHandlerContext } from '../../../packages/iwent/iwent-handler-context';
import { Todo } from '../models/todo.model';
import { table } from '../../../packages/relational';

export class CreateTodoHandler implements IwentHandler<CreateTodoEvent> {
  async handle(event: CreateTodoEvent, context: IwentHandlerContext): Promise<void> {
    await context.state.insert({
      into: table(Todo),
      insert: {
        id: event.id,
        name: event.name,
        completed: false,
        createdAt: context.metadata.createdAt,
      },
    });
  }
}
