import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { combineLatest, EMPTY } from 'rxjs';
import { mergeMap, catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentState, ComponentStateRef } from '@lithiumjs/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ComponentState.create(LoginComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends EntryBasePage {

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    router: Router,
    userUtils: UserUtils,
    snackBar: MatSnackBar,
    stateRef: ComponentStateRef<LoginComponent>
  ) {
    super(injector, cdRef, stateRef, snackBar);

    this.onSubmit$.pipe(
      mergeMap(() => combineLatest(stateRef.getAll("username", "password")).pipe(take(1))),
      mergeMap(([username, password]) => {
        return userUtils.login(username, password).pipe(
          catchError((error) => {
            this.error = error;
            return EMPTY;
          })
        );
      }),
    ).subscribe(() => {
      // Go to the home page
      router.navigate(['/home']);
    });
  }
}
