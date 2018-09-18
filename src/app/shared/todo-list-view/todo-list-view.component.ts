import { Component, Input } from '@angular/core';
import { StateEmitter, OnInit } from '@lithiumjs/angular';
import { Subject, Observable } from 'rxjs';
import { TodoList } from '../../models/todo-list';

@Component({
  selector: 'app-todo-list-view',
  templateUrl: './todo-list-view.component.html',
  styleUrls: ['./todo-list-view.component.scss']
})
export class TodoListViewComponent {

  @OnInit()
  private onInit$: Observable<void>;

  @StateEmitter()
  @Input('list')
  private list$: Subject<TodoList>;

  constructor() {
  }
}
