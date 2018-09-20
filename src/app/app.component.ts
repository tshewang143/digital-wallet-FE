import { Component } from '@angular/core';
import { UserUtils } from './utils/user-utils.service';
import { Router } from '@angular/router';
import { StateEmitter } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from './store/session/session.store';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @StateEmitter({ readOnly: true })
  @Select(SessionState.getUser)
  public readonly user$: Observable<User>;

  constructor(userUtils: UserUtils, router: Router) {
    // Navigate the user to the home page if already logged in
    userUtils.loginFromStore().subscribe(() => router.navigate(['/home']));
  }
}
