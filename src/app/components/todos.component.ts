import { Component, ElementRef, TemplateRef, viewChild } from '@angular/core';
import { provideTodosStore, TodosStore } from '../store/todos.store';
import { MatDivider } from '@angular/material/divider';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatLine } from '@angular/material/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Todo } from '../models/todo.model';
import { TodoDialogComponent } from './dialog/todo-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todos.component.html',
  providers: [provideTodosStore()],
  imports: [
    MatDivider,
    MatToolbar,
    MatButton,
    MatList,
    MatListItem,
    MatIconButton,
    MatIcon,
    MatLine,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
})
export class TodosComponent {

  constructor(protected readonly store: TodosStore, protected readonly dialog: MatDialog) {}

  changeTodoCompletion(event: CdkDragDrop<Todo[]>): void {
    this.store.updateTodo({ id: event.item.data.id, completed: !event.item.data.completed });
  }

  openUpsertDialog(todo?: Todo): void {
    this.dialog.open(TodoDialogComponent, { data: { todo } });
  }
}
