import * as _ from 'lodash';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { UpdateUserAction } from './../../store/session/session.actions';
import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { AfterViewInit, ComponentStateRef, ComponentState, AsyncState, OnDestroy, ManagedSubject, ManagedBehaviorSubject } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from '../../store/session/session.store';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Store } from '@ngxs/store';
import { take, mergeMap, mergeMapTo, filter, withLatestFrom, mapTo, map, delay, shareReplay, tap, takeUntil } from 'rxjs/operators';
import { TodoList } from '../../models/todo-list';
import { SessionUtils } from '../../utils/session-utils.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ComponentState.create(HomeComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends BaseComponent {

  @AfterViewInit()
  private readonly afterViewInit$!: Observable<void>;

  @OnDestroy()
  private readonly onDestroy$!: Observable<void>;

  @Select(SessionState.getUser)
  public readonly user$!: Observable<User>;

  @AsyncState()
  public user!: User;

  @Select(SessionState.getTodoLists)
  public readonly todoLists$!: Observable<User.TodoListDictionary>;

  @ViewChild('newListNameInput')
  public newListNameInput!: ElementRef<HTMLElement>;

  public readonly onAddList$ = new ManagedSubject<void>(this);
  public readonly onNewListNameInputBlur$ = new ManagedSubject<void>(this);
  public readonly onLogout$ = new ManagedSubject<void>(this);
  public readonly onListChanged$ = new ManagedSubject<TodoList>(this);
  public readonly onDeleteList$ = new ManagedSubject<string>(this);
  public readonly onHelp$ = new ManagedSubject<void>(this);

  public todoListNames: string[] = [];
  public newListName: string = '';
  public showMenu = false;
  public showNewListNameInput = false;
  public activeListName?: string = undefined;

  private readonly firstTodoListName$: Observable<string>;

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    stateRef: ComponentStateRef<HomeComponent>,
    store: Store,
    sessionUtils: SessionUtils,
    router: Router,
    dialog: MatDialog
  ) {
    super(injector, cdRef);

    const deleteDialogOpened$ = new ManagedBehaviorSubject<boolean>(this, false);
    const helpDialogOpened$ = new ManagedBehaviorSubject<boolean>(this, false);

    // Get the first todo list name in the list
    this.firstTodoListName$ = stateRef.get('todoListNames').pipe(
      map(todoListNames => todoListNames.length > 0 ? _.first(todoListNames) : undefined),
      shareReplay(1)
    );

    // Highlight the first todo list initially
    stateRef.get('user').pipe(
      mergeMapTo(this.firstTodoListName$),
      filter<string>(Boolean),
      take(1),
    ).subscribe(listName => this.activeListName = listName);

    // Wait for showNewListNameInput to become true...
    stateRef.get('showNewListNameInput').pipe(
      filter(Boolean),
      delay(100)
    ).subscribe(() => this.newListNameInput.nativeElement.focus()); // Focus the input box

    // Wait for the list of todo lists to be updated...
    this.todoLists$.pipe(
      takeUntil(this.onDestroy$),
      map(todoLists => _.keys(todoLists)),
      map(todoListNames => _.orderBy(todoListNames)) // Sort the list
    ).subscribe(todoListNames => this.todoListNames = todoListNames); // Update the todo list names

    // Wait for the user to press the add list button...
    this.onAddList$.subscribe(() => this.showNewListNameInput = true); // Show the list name input

    // Wait for a list to be changed...
    this.onListChanged$.subscribe(() => store.dispatch(new UpdateUserAction(this.user))); // Update the store

    // Wait for the user to press the delete button...
    this.onDeleteList$.pipe(
      withLatestFrom(deleteDialogOpened$),
      filter(([, opened]) => !opened),
      mergeMap(([listName]: [string, boolean]): Observable<string> => {
        deleteDialogOpened$.next(true);

        // Confirm with the user that they want to delete the list...
        return dialog.open(DeleteDialogComponent).afterClosed().pipe(
          tap(() => deleteDialogOpened$.next(false)),
          filter(Boolean),
          mapTo(listName)
        );
      }),
      mergeMap((listName) => {
        // Delete the list
        this.user.todoLists = _.omit(this.user.todoLists, [listName]);

        // Update the store
        return store.dispatch(new UpdateUserAction(this.user));
      }),
      mergeMap(() => this.firstTodoListName$.pipe(take(1)))
    ).subscribe((listName) => {
      // Focus the first list
      this.activeListName = listName;
    });

    // Wait for the new list field to be blurred...
    this.onNewListNameInputBlur$.subscribe(() => {
      // Make sure list name is unique
      while (_.keys(this.user.todoLists).includes(this.newListName)) {
        this.newListName += ' - 1';
      }

      // Add the list to the user
      if (this.newListName.length > 0) {
        this.user.todoLists = Object.assign({
          [this.newListName]: {
            todo: [],
            completed: []
          }
        }, this.user.todoLists);

        store.dispatch(new UpdateUserAction(this.user));

        // Focus the new list
        this.activeListName = this.newListName;
      }

      // Clear the input box and hide it
      this.newListName = '';
      this.showNewListNameInput = false;
    });

    // Wait for the user to click the help button...
    this.onHelp$.pipe(
      mergeMap(() => helpDialogOpened$.pipe(take(1))),
      filter(opened => !opened),
      mergeMap(() => {
        helpDialogOpened$.next(true);

        return dialog.open(HelpDialogComponent).afterClosed();
      })
    ).subscribe(() => helpDialogOpened$.next(false));

    // Wait for the user to click the logout button...
    this.onLogout$.subscribe(() => {
      sessionUtils.invalidate();
      router.navigate(['']);
    });

    // Show the side menu after the page loads
    this.afterViewInit$.pipe(
      delay(850)
    ).subscribe(() => {
      this.showMenu = true;
    });
  }
}
