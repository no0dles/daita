import { iwentTest } from '@daita/iwent/iwent-test';
import { todoApplication } from '../todo.application';

describe('todo/handlers/create-todo', () => {
  it('should create todo', () => {
    const state = iwentTest(todoApplication);
  });
});
