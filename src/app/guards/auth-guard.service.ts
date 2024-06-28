import moment from 'moment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionState } from '../store/session/session.store';

@Injectable({ providedIn: "root" })
export class AuthGuard  {

  constructor(private readonly router: Router, private readonly store: Store) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(SessionState.get).pipe(
      map(session => session && moment().isBefore(session.expiresDate)),
      map(canActivate => {
        if (!canActivate) {
          this.router.navigate(['/login']);
        }

        return canActivate;
      })
    );
  }
}
