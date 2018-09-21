import { Component, Input, EventEmitter, Output } from '@angular/core';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Subject, Observable } from 'rxjs';
import { TodoList } from '../../models/todo-list';
import { withLatestFrom, delay, filter, distinctUntilChanged } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatCheckbox } from '@angular/material';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss']
})
export class TodoListViewComponent {

  @EventSource()
  private readonly onCompleteItem$: Observable<[number, MatCheckbox]>;

  @EventSource()
  private readonly onAddTask$: Observable<string>;

  @Output('listChanged')
  @StateEmitter()
  @Input('list')
  private readonly list$: Subject<TodoList>;

  @StateEmitter()
  @Input('name')
  public readonly name$: Subject<string>;

  constructor() {
    // Wait for an item to be checked...
    this.onCompleteItem$.pipe(
      withLatestFrom(this.list$),
      delay(900)
    ).subscribe(([[index, checkbox], list]: [[number, MatCheckbox], TodoList]) => {
      // Move the item from the todo list to the completed list
      const [item] = list.todo.splice(index, 1);
      list.completed.push(item);
      checkbox.checked = false;

      this.list$.next(list);
    });

    // Wait for a task to be added...
    this.onAddTask$.pipe(
      filter(item => item.length > 0),
      withLatestFrom(this.list$)
    ).subscribe(([item, list]: [string, TodoList]) => {
      // Add the item to the list
      list.todo.push(item);
      this.list$.next(list);
    });
  }
}
