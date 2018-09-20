import { Component } from '@angular/core';
import { Subject, combineLatest, Observable, empty } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends EntryBasePage {

  constructor(router: Router, userUtils: UserUtils, snackBar: MatSnackBar) {
    super(snackBar);

    // Only enable the login button if the user entered both a username and password
    combineLatest(this.username$, this.password$).pipe(
      map(([username, password]) => !!username && !!password)
    ).subscribe(this.formSubmissionEnabled$);

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
