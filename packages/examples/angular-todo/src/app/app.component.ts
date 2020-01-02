import {Component} from '@angular/core';
import {TodoViewModel} from '../view-models/todo-view-model';
import {TodoViewStore} from '../services/todo-view-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  newTodoText = '';

  constructor(private todoStore: TodoViewStore) {

  }

  stopEditing(todo: TodoViewModel, editedTitle: string) {
    todo.title = editedTitle;
    todo.editing = false;
  }

  cancelEditingTodo(todo: TodoViewModel) {
    todo.editing = false;
  }

  updateEditingTodo(todo: TodoViewModel, editedTitle: string) {
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return this.todoStore.remove(todo);
    }

    todo.title = editedTitle;
  }

  editTodo(todo: TodoViewModel) {
    todo.editing = true;
  }

  async removeCompleted() {
    await this.todoStore.removeCompleted();
  }

  async toggleCompletion(todo: TodoViewModel) {
    await this.todoStore.toggleCompletion(todo);
  }

  async remove(todo: TodoViewModel) {
    await this.todoStore.remove(todo);
  }

  async addTodo() {
    try {
      if (this.newTodoText.trim().length) {
        await this.todoStore.add(this.newTodoText);
        this.newTodoText = '';
      }
    } catch (e) {
      console.log(e)
    }
  }
}
