import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { Session } from '../models/session';
import { Store } from '@ngxs/store';
import { Observable, throwError, of } from 'rxjs';
import { SetAction, InvalidateAction } from '../store/session/session.actions';
import * as moment from 'moment';
import { User } from '../models/user';

@Injectable()
export class SessionUtils {

  @LocalStorage('session')
  private _session: Session | undefined;

  constructor(private store: Store) { }

  public get session(): Readonly<Session | undefined> {
    return this._session;
  }

  public init(user: User): Observable<Session> {
    this._session = {
      user,
      expiresDate: moment().add(1, 'day').toISOString()
    };

    this.store.dispatch(new SetAction(this._session));

    return of(this._session);
  }

  public invalidate() {
    this._session = undefined;
    this.store.dispatch(new InvalidateAction());
  }
}
