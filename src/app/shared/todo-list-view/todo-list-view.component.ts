import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Injector, EventEmitter } from '@angular/core';
import { ComponentStateRef, ComponentState, DeclareState, ManagedSubject } from '@lithiumjs/angular';
import { Observable, Subject } from 'rxjs';
import { TodoList } from '../../models/todo-list';
import { filter, bufferTime, skip } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss'],
  providers: [ComponentState.create(TodoListViewComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListViewComponent extends BaseComponent {

  public readonly onCompleteItem$ = new ManagedSubject<[number, MatCheckbox]>(this);
  public readonly onAddTask$ = new ManagedSubject<string>(this);
  
  @Input()
  @DeclareState()
  public list!: TodoList;

  @Input()
  public name: string = '';

  @Output('listChanged')
  public readonly listChanged$ = new EventEmitter<TodoList>();

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    stateRef: ComponentStateRef<TodoListViewComponent>,
  ) {
    super(injector, cdRef);

    stateRef.get('list').pipe(skip(1)).subscribe(this.listChanged$);

    // Wait for items to be checked...
    this.onCompleteItem$.pipe(
      bufferTime(900),
      filter(items => items.length > 0)
    ).subscribe((collectedItems: [number, MatCheckbox][]) => {
      collectedItems.forEach(([index, checkbox]) => {
        // Move the item from the todo list to the completed list
        const item = this.list.todo[index];
        delete this.list.todo[index];
        this.list.completed.push(item);
        checkbox.checked = false;
      });

      // Filter out the deleted items
      this.list = Object.assign(this.list, {
        todo: this.list.todo.filter(Boolean)
      });
    });

    // Wait for a task to be added...
    this.onAddTask$.pipe(
      filter(item => item.length > 0)
    ).subscribe((item) => {
      // Add the item to the list
      this.list = Object.assign(this.list, {
        todo: this.list.todo.concat([item])
      });
    });
  }
}
