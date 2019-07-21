import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UserUtils } from './utils/user-utils.service';
import { Router } from '@angular/router';
import { StateEmitter, AotAware, AutoPush } from '@lithiumjs/angular';
import { Select } from '@ngxs/store';
import { SessionState } from './store/session/session.store';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoPush()
export class AppComponent extends AotAware {

  @StateEmitter({ readOnly: true })
  @Select(SessionState.getUser)
  public readonly user$: Observable<User>;

  @StateEmitter({ readOnly: true })
  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Observable<boolean>;

  constructor(userUtils: UserUtils, router: Router, _cdRef: ChangeDetectorRef) {
    super();

    // Navigate the user to the home page if already logged in
    userUtils.loginFromStore().subscribe(() => router.navigate(['/home']));
  }
}
