import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { UpdateUserAction } from './../../store/session/session.actions';
import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { StateEmitter, EventSource, AfterViewInit } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from '../../store/session/session.store';
import { Observable, Subject, merge, fromEvent } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngxs/store';
import { take, mergeMap, mergeMapTo, filter, withLatestFrom, mapTo, map, delay, shareReplay } from 'rxjs/operators';
import { TodoList } from '../../models/todo-list';
import { SessionUtils } from '../../utils/session-utils.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MatSidenavContainer, MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @AfterViewInit()
  private afterViewInit$: Observable<void>;

  @EventSource()
  private onAddList$: Observable<void>;

  @EventSource()
  private onNewListNameInputBlur$: Observable<void>;

  @EventSource()
  private onLogout$: Observable<void>;

  @EventSource()
  private onListChanged$: Observable<TodoList>;

  @EventSource()
  private onDeleteList$: Observable<string>;

  @StateEmitter.Alias({ path: 'user$' }) // TODO - Explicit self-proxy shouldn't be needed here
  @Select(SessionState.getUser)
  private user$: Observable<User>;

  @Select(SessionState.getTodoLists)
  private todoLists$: Observable<User.TodoListDictionary>;

  @StateEmitter({ initialValue: [] })
  private todoListNames$: Subject<string[]>;

  @StateEmitter()
  private activeTodoList$: Subject<TodoList>;

  @StateEmitter({ initialValue: '' })
  private newListName$: Subject<string>;

  @StateEmitter()
  private showNewListNameInput$: Subject<boolean>;

  @StateEmitter()
  private showMenu$: Subject<boolean>;

  @ViewChild('newListNameInput')
  private newListNameInput: ElementRef;

  @ViewChild('container')
  private container: MatSidenavContainer;

  private firstTodoList$: Observable<TodoList>;

  constructor(
    store: Store,
    sessionUtils: SessionUtils,
    router: Router,
    dialog: MatDialog
  ) {
    this.firstTodoList$ = this.todoListNames$.pipe(
      map(todoListNames => todoListNames.length > 0 ? _.first(todoListNames) : undefined),
      withLatestFrom(this.user$),
      map(([listName, user]) => listName ? user.todoLists[listName] : undefined),
      shareReplay(1)
    );

    // Wait for the list of todo lists to be updated...
    this.todoLists$.pipe(
      map(todoLists => _.keys(todoLists)),
      map(todoListNames => _.orderBy(todoListNames)) // Sort the list
    ).subscribe(this.todoListNames$);

    // Highlight the first todo list initially
    this.user$.pipe(
      mergeMapTo(this.firstTodoList$),
      filter(Boolean),
      take(1),
    ).subscribe(todoList => this.activeTodoList$.next(todoList));

    // Wait for the user to press the add list button...
    this.onAddList$.pipe(
      mapTo(true)
    ).subscribe(this.showNewListNameInput$); // Show the list name input

    // Wait for a list to be changed...
    this.onListChanged$.pipe(
      mergeMap(() => this.user$.pipe(take(1)))
    ).subscribe(user => store.dispatch(new UpdateUserAction(user))); // Update the store

    // Wait for the user to press the delete button...
    this.onDeleteList$.pipe(
      mergeMap((listName): Observable<string> => {
        // Confirm with the user that they want to delete the list...
        return dialog.open(DeleteDialogComponent).afterClosed().pipe(
          filter(Boolean),
          mapTo(listName)
        );
      }),
      withLatestFrom(this.user$),
      mergeMap(([listName, user]) => {
        // Delete the list
        user.todoLists = _.omit(user.todoLists, [listName]);

        // Update the store
        return store.dispatch(new UpdateUserAction(user));
      }),
      mergeMap(() => this.firstTodoList$.pipe(take(1)))
    ).subscribe(firstTodoList => this.activeTodoList$.next(firstTodoList));

    // Wait for the new list field to be blurred...
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

        // Focus the new list
        this.activeTodoList$.next(user.todoLists[newListName]);
      }

      // Clear the input box and hide it
      this.newListName$.next('');
      this.showNewListNameInput$.next(false);
    });

    // Wait for the user to click the logout button...
    this.onLogout$.subscribe(() => {
      sessionUtils.invalidate();
      router.navigate(['']);
    });

    // Wait for showNewListNameInput to become true...
    this.showNewListNameInput$.pipe(
      filter(Boolean),
      delay(100)
    ).subscribe(() => this.newListNameInput.nativeElement.focus()); // Focus the input box

    // Workaround for broken MatSidenavContainer resizing in @angular/material
    // Adapted from: https://github.com/angular/material2/issues/6743#issuecomment-328453963
    this.afterViewInit$.pipe(
      delay(0),
      map(() => this.showMenu$.next(true)),
      mergeMap(() => merge((<any>this.container)._ngZone.onMicrotaskEmpty, fromEvent(window, 'resize'))),
    ).subscribe(() => {
      (<any>this.container)._updateContentMargins();
      (<any>this.container)._changeDetectorRef.markForCheck();
    });
  }
}
