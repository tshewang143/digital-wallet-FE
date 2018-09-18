import { Component } from '@angular/core';
import { Subject, combineLatest, Observable, empty } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @EventSource()
  private onSubmit$: Observable<void>;

  @StateEmitter()
  private username$: Subject<string>;

  @StateEmitter()
  private password$: Subject<string>;

  @StateEmitter({ readOnly: true })
  private loginEnabled$: Subject<boolean>;

  constructor(router: Router, userUtils: UserUtils) {
    // Only enable the login button if the user entered both a username and password
    combineLatest(this.username$, this.password$).pipe(
      map(([username, password]) => !!username && !!password)
    ).subscribe(this.loginEnabled$);

    this.onSubmit$.pipe(
      mergeMap(() => combineLatest(this.username$, this.password$).pipe(take(1))),
      mergeMap(([username, password]) => {
        return userUtils.login(username, password).pipe(
          catchError((error) => {
            // TODO - Set error in UI
            console.error(error);
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
