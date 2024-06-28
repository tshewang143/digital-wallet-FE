# lithium-angular-example-app

## **[Live Demo](https://lvlyke.github.io/lithium-angular-example-app)**

A simple TODO list app built with Angular and [@lithiumjs/angular](https://github.com/lVlyke/lithium-angular).

This project was created to demonstrate how Lithium for Angular enables creating performant Angular components with very little boilerplate by fully leveraging Observables and Zone-less change detection. The project also makes use of other libraries like [ngxs/store](https://github.com/ngxs/store) to show how Lithium integrates with other libraries.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Running the app

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building the app

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Using the app

This is a basic todo list app that allows you to register a user (or multiple users) and manage multiple todo lists per user.

Features:

* Create user accounts and save your todo data.
* Create and manage multiple todo lists and track completed tasks.
* Full session and state mangement.
* Serialization and deserialization of user and session data (via your own browser's local storage).
* Responsive UI design using [```Angular Material```](https://material.angular.io/).

To use the app, you must first register a user. Once you have created a user, you will be redirected to the homepage, where you can start creating and managing todo lists.

## The code - Points of interest

The application is fully Zone-less via the use of `provideExperimentalZonelessChangeDetection()`. All change detection is handled automatically by Lithium via `AutoPush`. This is enabled in `BaseComponent`, the common base class for all components in the app:

```ts
export class BaseComponent {

    constructor(
        protected readonly injector: Injector,
        cdRef?: ChangeDetectorRef
    ) {
        if (cdRef) {
            // Enables automatic push-based change detection for this class:
            AutoPush.enable(this, cdRef);
        }
    }
}
```

The project contains several components that showcase common use cases that you may encounter when writing an Angular application and how Lithium for Angular can be used effectively in these scenarios. Several examples are:

### Basic usage of `ComponentState` and `ComponentStateRef`

There are many usages of `ComponentState` and `ComponentStateRef` in the application. One example is the [`HomeComponent`](/src/app/pages/home/home.component.ts):

```ts
...

public showNewListNameInput = false;

...

constructor(
    stateRef: ComponentStateRef<HomeComponent>
) {
    // Wait for showNewListNameInput to become true...
    stateRef.get('showNewListNameInput').pipe(
        filter(Boolean),
        delay(100)
    ).subscribe(() => this.newListNameInput.nativeElement.focus()); // Focus the input box

    ...
}
```

### Using `ComponentStateRef` in base component classes

The [```EntryBasePage```](/src/app/pages/base/entry/entry-base-page.ts) class is a base component class that makes use of `ComponentStateRef`:

```ts
...

constructor() {
    const stateRef = injector.get<ComponentStateRef<EntryBasePage>>(ComponentStateRef);

    stateRef.get("error").pipe(
        filter<string>(Boolean)
    ).subscribe(error => {
        console.error(error);
        snackBar.open(error, 'Dismiss', { verticalPosition: 'top' });
    });

    ...
}
```

### Using `@AsyncState` to alias external observables

The [`HomeComponent`](/src/app/pages/home/home.component.ts) makes use of the `@AsyncState` decorator to create a synchronous alias of an external state Observable from NGXS:

```ts
class HomeComponent {
    ...

    public readonly user$!: Observable<User> = this.store.select(SessionState.getUser);

    // `user` automatically receives all emissions from `user$`
    @AsyncState()
    public user!: User;

    ...

    constructor() {
        ...

        this.onListChanged$.subscribe(() => store.dispatch(new UpdateUserAction(this.user)));
    }
}
```

### Using `@DeclareState` to enable observation of undeclared properties

The [`TodoListViewComponent`](/src/app/shared/todo-list-view/todo-list-view.component.ts) uses the `@DeclareState` decorator to declare an undeclared property to Lithium:

```ts
class TodoListViewComponent extends BaseComponent {

    @Input()
    @DeclareState()
    public list!: TodoList;

    ...
}
```
