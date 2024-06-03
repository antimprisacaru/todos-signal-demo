import { Component, Inject } from '@angular/core';
import { provideTodosStore, TodosStore } from '../../store/todos.store';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Todo } from '../../models/todo.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-upsert',
  standalone: true,
  template: `<h2 mat-dialog-title>{{ id ? 'Edit Todo' : 'Add Todo' }}</h2>

    <mat-dialog-content>
      <form>
        <mat-form-field>
          <mat-label>Todo</mat-label>
          <input matInput [formControl]="text" />
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="text.invalid" (click)="upsertTodo()">Save</button>
    </mat-dialog-actions>`,
  providers: [provideTodosStore()],
  imports: [MatDialogModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
})
export class TodoDialogComponent {
  protected readonly id?: string;
  protected readonly text: FormControl<string>;

  constructor(
    private store: TodosStore,
    protected readonly dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data?: { todo?: Todo }
  ) {
    this.id = data?.todo?.id;
    this.text = new FormControl(data?.todo?.text ?? '', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true,
    });
  }

  upsertTodo(): void {
    if (this.id) {
      this.store.updateTodo({ id: this.id, text: this.text.value });
    } else {
      this.store.addTodo({ text: this.text.value });
    }
    this.dialogRef.close();
  }
}
