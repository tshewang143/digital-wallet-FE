import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { Session } from '../models/session';
import { Store, Select } from '@ngxs/store';
import { Observable, throwError, of } from 'rxjs';
import { SetAction, InvalidateAction } from '../store/session/session.actions';
import * as moment from 'moment';
import { User } from '../models/user';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';

@Injectable()
export class SessionUtils {

  @LocalStorage('session')
  private _session: Session | undefined;

  @LocalStorage()
  private users: User[] = [];

  @Select()
  private session$: Observable<Session>;

  constructor(private store: Store) {
    // Wait for the session to change...
    this.session$.pipe(
      filter(Boolean)
    ).subscribe(session => {
      // Update the local store
      this._session = session;
      this.users.splice(_.findIndex(this.users, { id: session.user.id }), 1, session.user);
    });
  }

  public get session(): Readonly<Session | undefined> {
    return this._session;
  }

  public init(user: User): Observable<Session> {
    this._session = <any>{};
    this._session.expiresDate = moment().add(1, 'day').toISOString();
    this._session.user = user;

    this.store.dispatch(new SetAction(this._session));

    return of(this._session);
  }

  public invalidate() {
    this._session = undefined;
    this.store.dispatch(new InvalidateAction());
  }
}
