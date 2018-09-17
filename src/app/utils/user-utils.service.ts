import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { LocalStorage } from 'ngx-store';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { SessionUtils } from './session-utils.service';
import { Session } from '../models/session';

@Injectable()
export class UserUtils {

  @LocalStorage()
  private users: User[] = [];

  constructor(private sessionUtils: SessionUtils) { }

  public encodeSecret(password: string): string {
    // WARNING: This is NOT a secure password hashing algorithm
    // This is just provided as an example
    return btoa(password);
  }

  public login(id: string, password: string): Observable<Session> {
    return this.loginAs({
      id,
      secret: this.encodeSecret(password)
    });
  }

  public loginAs(user: Partial<User>): Observable<Session> {
    const foundUser = this.getUserById(user.id);

    if (!foundUser) {
      return throwError(`User not found: ${user.id}.`);
    }

    if (user.secret !== foundUser.secret) {
      return throwError('Incorrect password.');
    }

    console.log(`Logged in as ${user.id}.`);

    // Update the session
    return this.sessionUtils.init(foundUser);
  }

  public loginFromStore(): Observable<Session> {
    const session = this.sessionUtils.session;

    if (!session) {
      return throwError('No session found.');
    }

    if (!session.user || !this.getUserById(session.user.id)) {
      return throwError('Session is invalid.');
    }

    if (moment().isAfter(session.expiresDate)) {
      return throwError('Session is expired.');
    }

    this.loginAs(session.user);

    return of(session);
  }

  public register(name: string, id: string, password: string): Observable<User> {
    if (this.getUserById(id)) {
      return throwError(`User already exists ${id}.`);
    }

    const user = {
      name: name,
      id: id,
      secret: this.encodeSecret(password),
      todoLists: {}
    };

    // add the user
    this.users.push(user);

    return of(user);
  }

  public logout() {
    this.sessionUtils.invalidate();
  }

  public getUserById(id: string): User {
    return _.find(this.users, { id });
  }
}
