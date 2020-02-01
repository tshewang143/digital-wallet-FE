import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { combineLatest, empty } from 'rxjs';
import { mergeMap, catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends EntryBasePage {

  constructor(injector: Injector, cdRef: ChangeDetectorRef, router: Router, userUtils: UserUtils, snackBar: MatSnackBar) {
    super(injector, cdRef, snackBar);

    this.onSubmit$.pipe(
      mergeMap(() => combineLatest(this.username$, this.password$).pipe(take(1))),
      mergeMap(([username, password]) => {
        return userUtils.login(username, password).pipe(
          catchError((error) => {
            this.error$.next(error);
            return empty();
          })
        );
      }),
    ).subscribe(() => {
      // Go to the home page
      router.navigate(['/home']);
    });
  }
}
