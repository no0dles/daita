import { IwentHandler } from '@daita/iwent';
import { CompleteTodoEvent } from '../events/complete-todo.event';
import { IwentHandlerContext } from '@daita/iwent';
import { field, table } from '@daita/relational';
import { Todo } from '../models/todo.model';
import { equal } from '@daita/relational';

export class CompleteTodoHandler implements IwentHandler<CompleteTodoEvent> {
  async handle(event: CompleteTodoEvent, context: IwentHandlerContext): Promise<void> {
    await context.state.update({
      update: table(Todo),
      set: {
        completed: true,
      },
      where: equal(field(Todo, 'id'), event.id),
    });
  }
}
