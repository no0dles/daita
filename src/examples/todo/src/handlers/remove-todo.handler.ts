import { IwentHandler } from '@daita/iwent/iwent-handler';
import { RemoveTodoEvent } from '../events/remove-todo.event';
import { IwentHandlerContext } from '@daita/iwent/iwent-handler-context';
import { field, table } from '@daita/relational';
import { Todo } from '../models/todo.model';
import { equal } from '@daita/relational';

export class RemoveTodoHandler implements IwentHandler<RemoveTodoEvent> {
  async handle(event: RemoveTodoEvent, context: IwentHandlerContext): Promise<void> {
    await context.state.delete({
      delete: table(Todo),
      where: equal(field(Todo, 'id'), event.id),
    });
  }
}
