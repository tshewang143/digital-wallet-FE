import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Session } from '../models/session';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  @Select()
  public session$: Observable<Session>;

  constructor(private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.session$.pipe(
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
