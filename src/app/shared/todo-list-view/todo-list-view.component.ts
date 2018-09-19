import { Component, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { StateEmitter, EventSource, OnInit } from '@lithiumjs/angular';
import { Subject, Observable } from 'rxjs';
import { TodoList } from '../../models/todo-list';
import { withLatestFrom, delay, filter } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss']
})
export class TodoListViewComponent {

  @OnInit()
  private onInit$: Observable<void>;

  @EventSource()
  private onCompleteItem$: Observable<string>;

  @EventSource()
  private onAddTask$: Observable<string>;

  @Output('listChanged')
  @StateEmitter()
  @Input('list')
  private list$: Subject<TodoList>;

  constructor(changeDetector: ChangeDetectorRef) {
    // Wait for an item to be checked...
    this.onCompleteItem$.pipe(
      withLatestFrom(this.list$),
      delay(900)
    ).subscribe(([item, list]: [string, TodoList]) => {
      // Move the item to the completed list
      this.list$.next(Object.assign(list, {
        todo: _.without(list.todo, item),
        completed: list.completed.concat(item)
      }));
    });

    // Wait for a task to be added...
    this.onAddTask$.pipe(
      filter(item => item.length > 0),
      withLatestFrom(this.list$)
    ).subscribe(([item, list]: [string, TodoList]) => {
      // Add the item to the list
      this.list$.next(Object.assign(list, { todo: list.todo.concat(item) }, ));
    });
  }
}
