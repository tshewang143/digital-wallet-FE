import { Component } from '@angular/core';
import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Subject, combineLatest, Observable, empty } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { LocalStorage } from 'ngx-store';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserUtils } from '../../utils/user-utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @EventSource()
  private onSubmit$: Observable<void>;

  @StateEmitter()
  private name$: Subject<string>;

  @StateEmitter()
  private username$: Subject<string>;

  @StateEmitter()
  private password$: Subject<string>;

  @StateEmitter({ readOnly: true })
  private registerEnabled$: Subject<boolean>;

  constructor(router: Router, userUtils: UserUtils) {
    // Only enable the login button if the user entered both a username and password
    combineLatest(this.username$, this.password$).pipe(
      map(([username, password]) => !!username && !!password)
    ).subscribe(this.registerEnabled$);

    this.onSubmit$.pipe(
      mergeMap(() => combineLatest(this.name$, this.username$, this.password$).pipe(take(1))),
      mergeMap(([name, username, password]: [string, string, string]) => {
        return userUtils.register(name, username, password).pipe(
          catchError((error) => {
            // TODO Error UI
            console.error(error);
            return empty();
          })
        );
      }),
      mergeMap((user) => {
        // Log the user in
        return userUtils.loginAs(user).pipe(
          catchError((error) => {
            // TODO Error UI
            console.error(error);
            return empty();
          })
        );
      }),
      map(() => router.navigate(['/home'])), // Navigate home
    ).subscribe();
  }
}
