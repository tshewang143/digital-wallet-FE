import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentState } from '@lithiumjs/angular';

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
    snackBar: MatSnackBar
  ) {
    super(injector, cdRef, snackBar);

    this.onSubmit$.pipe(
      mergeMap(() => {
        return userUtils.login(this.username, this.password).pipe(
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
