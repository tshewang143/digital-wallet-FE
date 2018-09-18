import { UpdateUserAction } from './../../store/session/session.actions';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from '../../store/session/session.store';
import { Observable, Subject } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngxs/store';
import { take, mergeMap, mergeMapTo, filter, withLatestFrom, mapTo, map, delay } from 'rxjs/operators';
import { TodoList } from '../../models/todo-list';
import { SessionUtils } from '../../utils/session-utils.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @EventSource()
  private onAddList$: Observable<void>;

  @EventSource()
  private onNewListNameInputBlur$: Observable<void>;

  @EventSource()
  private onLogout$: Observable<void>;

  @StateEmitter.Alias({ path: 'user$' }) // TODO - Explicit self-proxy shouldn't be needed here
  @Select(SessionState.getUser)
  private user$: Observable<User>;

  @Select(SessionState.getTodoLists)
  private todoLists$: Observable<User.TodoListDictionary>;

  @StateEmitter()
  private todoListNames$: Subject<string[]>;

  @StateEmitter()
  private activeTodoList$: Subject<TodoList>;

  @StateEmitter({ initialValue: '' })
  private newListName$: Subject<string>;

  @StateEmitter()
  private showNewListNameInput$: Subject<boolean>;

  @ViewChild('newListNameInput') private newListNameInput: ElementRef;

  constructor(store: Store, sessionUtils: SessionUtils, router: Router) {
    this.todoLists$.pipe(
      map(todoLists => _.keys(todoLists))
    ).subscribe(this.todoListNames$);

    // Highlight the first todo list
    this.user$.pipe(
      take(1),
      map(user => user.todoLists),
      filter(todoLists => _.keys(todoLists).length > 0)
    ).subscribe(todoLists => this.activeTodoList$.next(todoLists[_.keys(todoLists)[0]]));

    this.onAddList$.pipe(
      mapTo(true)
    ).subscribe(this.showNewListNameInput$);

    this.onNewListNameInputBlur$.pipe(
      mergeMap(() => this.newListName$.pipe(take(1))),
      withLatestFrom(this.user$)
    ).subscribe(([newListName, user]: [string, User]) => {
      // Make sure list name is unique
      while (_.keys(user.todoLists).includes(newListName)) {
        newListName += ' - 1';
      }

      // Add the list to the user
      if (newListName.length > 0) {
        user.todoLists = Object.assign({
          [newListName]: {
            todo: [],
            completed: []
          }
        }, user.todoLists);

        store.dispatch(new UpdateUserAction(user));

        // Focus the new list if this is the first one
        if (_.keys(user.todoLists).length === 1) {
          this.activeTodoList$.next(user.todoLists[newListName]);
        }
      }

      this.newListName$.next('');
      this.showNewListNameInput$.next(false);
    });

    this.onLogout$.subscribe(() => {
      sessionUtils.invalidate();
      router.navigate(['']);
    });

    this.showNewListNameInput$.pipe(
      delay(100)
    ).subscribe(() => this.newListNameInput.nativeElement.focus());
  }
}
