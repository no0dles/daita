import { IwentHandler } from '../../../packages/iwent/iwent-handler';
import { CompleteTodoEvent } from '../events/complete-todo.event';
import { IwentHandlerContext } from '../../../packages/iwent/iwent-handler-context';
import { field, table } from '../../../packages/relational';
import { Todo } from '../models/todo.model';
import { equal } from '../../../packages/relational/sql/operands/comparison/equal/equal';

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
