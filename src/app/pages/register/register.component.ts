import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { ComponentState, ComponentStateRef } from '@lithiumjs/angular';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ComponentState.create(RegisterComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent extends EntryBasePage {

  public name = '';

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    stateRef: ComponentStateRef<RegisterComponent>,
    router: Router,
    userUtils: UserUtils, 
    snackBar: MatSnackBar
  ) {
    super(injector, cdRef, snackBar, stateRef.get('name'));

    this.onSubmit$.pipe(
      mergeMap(() => {
        return userUtils.register(this.name, this.username, this.password).pipe(
          catchError((error) => {
            this.error = error;
            return EMPTY;
          })
        );
      }),
      mergeMap((user) => {
        // Log the user in
        return userUtils.loginAs(user).pipe(
          catchError((error) => {
            this.error = error;
            return EMPTY;
          })
        );
      }),
      map(() => router.navigate(['/home'])), // Navigate home
    ).subscribe();
  }
}
