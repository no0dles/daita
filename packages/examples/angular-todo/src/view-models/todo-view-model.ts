import {Todo} from '../models/todo';

export class TodoViewModel {
  editing: boolean;

  get id() {
    return this.todo.id;
  }

  get title() {
    return this.todo.name;
  }

  set title(value: string) {
    this.todo.name = value.trim();
  }

  get completed() {
    return this.todo.done;
  }

  set completed(value: boolean) {
    this.todo.done = value;
  }

  constructor(private todo: Todo) {
    this.editing = false;
  }
}
