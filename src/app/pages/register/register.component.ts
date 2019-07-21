import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StateEmitter, AutoPush } from '@lithiumjs/angular';
import { Subject, combineLatest, empty, BehaviorSubject } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoPush()
export class RegisterComponent extends EntryBasePage {

  @StateEmitter()
  private name$: Subject<string>;

  constructor(router: Router, userUtils: UserUtils, snackBar: MatSnackBar, _cdRef: ChangeDetectorRef) {
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
