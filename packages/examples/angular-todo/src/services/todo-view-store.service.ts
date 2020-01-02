import {Injectable} from '@angular/core';
import {schema} from '../schema';
import {SocketRelationalDataAdapter} from '@daita/web-client';
import {Todo} from '../models/todo';
import * as uuid from 'uuid';
import {TodoViewModel} from '../view-models/todo-view-model';
import {RelationalTransactionContext} from '@daita/core';

@Injectable({providedIn: 'root'})
export class TodoViewStore {
  todos: Array<TodoViewModel> = [];
  context: RelationalTransactionContext;

  constructor() {
    this.context = schema.context(new SocketRelationalDataAdapter('http://localhost:8765'));
    this.context.select(Todo).exec().then(persistedTodos => {
      this.todos = persistedTodos.map(todo => new TodoViewModel(todo));
    });
  }

  private getWithCompleted(completed: Boolean) {
    return this.todos.filter((todo: TodoViewModel) => todo.completed === completed);
  }

  allCompleted() {
    return this.todos.length === this.getCompleted().length;
  }

  async setAllTo(completed: boolean) {
    await this.context.update(Todo).set({done: true}).exec();
    this.todos.forEach((t: TodoViewModel) => t.completed = completed);
  }

  async removeCompleted() {
    await this.context.delete(Todo).where({done: true}).exec();
    console.log(this.todos);
    this.todos = this.getWithCompleted(false);
  }

  getRemaining() {
    return this.getWithCompleted(false);
  }

  getCompleted() {
    return this.getWithCompleted(true);
  }

  async toggleCompletion(todo: TodoViewModel) {
    await this.context.update(Todo).set({done: !todo.completed}).where({id: todo.id}).exec();
    todo.completed = !todo.completed;
  }

  async remove(todo: TodoViewModel) {
    await this.context.delete(Todo).where({id: todo.id}).exec();
    this.todos.splice(this.todos.indexOf(todo), 1);
  }

  async add(title: string) {
    const todo = new Todo();
    todo.name = title;
    todo.id = uuid.v1();
    todo.done = false;
    await this.context.insert(Todo).value(todo).exec();
    const viewModel = new TodoViewModel(todo);
    this.todos.push(viewModel);
  }
}
