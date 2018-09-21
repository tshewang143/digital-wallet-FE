import { Component } from '@angular/core';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Subject, combineLatest, Observable, empty, BehaviorSubject } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { LocalStorage } from 'ngx-store';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends EntryBasePage {

  @StateEmitter()
  private name$: Subject<string>;

  constructor(router: Router, userUtils: UserUtils, snackBar: MatSnackBar) {
    // Create a proxy subejct that can be passed to super()
    const nameField$ = new BehaviorSubject<string>(undefined);

    super(snackBar, nameField$);

    this.name$.subscribe(nameField$);

    this.onSubmit$.pipe(
      mergeMap(() => combineLatest(this.name$, this.username$, this.password$).pipe(take(1))),
      mergeMap(([name, username, password]: [string, string, string]) => {
        return userUtils.register(name, username, password).pipe(
          catchError((error) => {
            this.error$.next(error);
            return empty();
          })
        );
      }),
      mergeMap((user) => {
        // Log the user in
        return userUtils.loginAs(user).pipe(
          catchError((error) => {
            this.error$.next(error);
            return empty();
          })
        );
      }),
      map(() => router.navigate(['/home'])), // Navigate home
    ).subscribe();
  }
}
