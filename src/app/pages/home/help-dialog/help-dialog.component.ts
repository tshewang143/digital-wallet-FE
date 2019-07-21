import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StateEmitter, AotAware, AutoPush } from '@lithiumjs/angular';
import { Select, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { SessionState } from '../../../store/session/session.store';
import { HideBannerAction } from '../../../store/session/session.actions';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoPush()
export class HelpDialogComponent extends AotAware {

  @StateEmitter.FromSelf()
  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Subject<boolean>;

  constructor(store: Store, _cdRef: ChangeDetectorRef) {
    super();

    this.hideBanner$.subscribe(hideBanner => store.dispatch(new HideBannerAction(hideBanner)));
  }
}
