import { IwentHandler } from '../../../packages/iwent/iwent-handler';
import { RemoveTodoEvent } from '../events/remove-todo.event';
import { IwentHandlerContext } from '../../../packages/iwent/iwent-handler-context';
import { field, table } from '../../../packages/relational';
import { Todo } from '../models/todo.model';
import { equal } from '../../../packages/relational/sql/operands/comparison/equal/equal';

export class RemoveTodoHandler implements IwentHandler<RemoveTodoEvent> {
  async handle(event: RemoveTodoEvent, context: IwentHandlerContext): Promise<void> {
    await context.state.delete({
      delete: table(Todo),
      where: equal(field(Todo, 'id'), event.id),
    });
  }
}
