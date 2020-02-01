import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { StateEmitter } from '@lithiumjs/angular';
import { Select, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { SessionState } from '../../../store/session/session.store';
import { HideBannerAction } from '../../../store/session/session.actions';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpDialogComponent extends BaseComponent {

  @StateEmitter.FromSelf()
  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Subject<boolean>;

  constructor(injector: Injector, cdRef: ChangeDetectorRef, store: Store) {
    super(injector, cdRef);

    this.hideBanner$.subscribe(hideBanner => store.dispatch(new HideBannerAction(hideBanner)));
  }
}
