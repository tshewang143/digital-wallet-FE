import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserUtils } from './utils/user-utils.service';
import { SessionState } from './store/session/session.store';
import { BaseComponent } from './core/base-component';
import { AppBannerComponent } from './shared/app-banner/app-banner.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,

    AppBannerComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {

  protected readonly hideBanner$!: Observable<boolean>;

  constructor(
    injector: Injector,
    cdRef: ChangeDetectorRef,
    userUtils: UserUtils,
    router: Router,
    store: Store
  ) {
    super(injector, cdRef);

    this.hideBanner$ = store.select(SessionState.hideBanner);

    // Navigate the user to the home page if already logged in
    userUtils.loginFromStore().subscribe({
      next: () => router.navigate(['/home']),
      error: console.info
    });
  }
}
