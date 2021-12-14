import { todoApplication } from '../todo.application';
import { iwentTest } from '@daita/iwent';

describe('todo/handlers/create-todo', () => {
  it('should create todo', () => {
    const state = iwentTest(todoApplication);
  });
});
