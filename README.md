# lithium-angular-example-app

## **[Live Demo](https://lvlyke.github.io/lithium-angular-example-app)**

This project was created to demonstrate how Lithium for Angular ([@lithiumjs/angular](https://github.com/lVlyke/lithium-angular)) can be used to write completely reactive Angular components with very little boilerplate. The project makes use of other libraries like [ngxs/store](https://github.com/ngxs/store) to show how Lithium can easily integrate with other libraries.

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

One goal of this project is to implement simple and concise reactive programming patterns to write Angular UI components. All component logic in the application uses reactive programming with almost no boilerplate code, enabled by the use of Lithium as well as libraries like NGXS/Store for reactive state management.

The project contains several components that showcase common use cases that you may encounter when writing an Angular application and how Lithium for Angular can be used effectively in these scenarios. Several examples are:

### Using Lithium for reactive two-way form binding

The [```LoginComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/login/login.component.ts) and [```RegisterComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/register/register.component.ts) components illustrate how Lithium's ```@StateEmitter()``` decorator can be used for seamless, fully reactive two-way data binding:

```ts
@EventSource()
protected onSubmit$: Observable<void>;

@StateEmitter()
protected username$: Subject<string>;

@StateEmitter()
protected password$: Subject<string>;

[...]

this.onSubmit$.pipe(
    mergeMap(() => combineLatest(this.username$, this.password$).pipe(take(1))),
    mergeMap(([username, password]) => userUtils.login(username, password).pipe([...]))
).subscribe(() => router.navigate(['/home']));
```

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit()">
    <mat-form-field>
        <input [...] name="username" [(ngModel)]="username">
    </mat-form-field>
    <mat-form-field>
          <input [...] name="password" [(ngModel)]="password">
    </mat-form-field>
    [...]
</form>
```

### Using Lithium with ```@Input()``` and ```Output()```

The [```TodoListViewComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/shared/todo-list-view/todo-list-view.component.ts) shows how Lithium can be used with Angular's built-in ```Input``` and ```Output``` decorators. The component also shows an example of how a single property decorated with ```@StateEmitter()``` can be used simutaneously as both an ```@Input()``` and ```@Output()``` (note that order is important):

```ts
@Output('listChanged')
@StateEmitter()
@Input('list')
private readonly list$: Subject<TodoList>;
```

### Using Lithium with NGXS/Store

Lithium is compatible with other reactive decorator-based libraries like NGXS/Store. The [```HomeComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/home/home.component.ts#L46) illustrates an example of using ```@StateEmitter()``` with ```@Select()``` from NGXS:

```ts
@StateEmitter.Alias({ path: 'user$' })
@Select(SessionState.getUser)
private readonly user$: Observable<User>;
```

A couple things to note:

* Since ```Select``` returns an ```Observable```, ```user$``` will also be an ```Observable``` instead of a ```Subject```.
* **@lithiumjs/angular v2.0.0 note:** Due to a limitation with bootstrapping, it is necessary to explictly use ```Alias``` on the property. See the [Lithium docs](https://github.com/lVlyke/lithium-angular#stateemitter) for more information.

### Using Lithium's ```@StateEmitter()``` and ```@EventSource()``` decorators with class inheritance

The [```EntryBasePage```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/base/entry/entry-base-page.ts) component is a base class that illustrates how both ```StateEmitter``` and ```EventSource``` can be declared in a parent class and can be used in the parent class as well as any child classes. This is useful for defining logic that is common to multiple components. This class is used by [```LoginComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/login/login.component.ts) and [```RegisterComponent```](https://github.com/lVlyke/lithium-angular-example-app/blob/master/src/app/pages/register/register.component.ts).