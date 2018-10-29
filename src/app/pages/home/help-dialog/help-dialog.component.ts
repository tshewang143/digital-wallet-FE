import { Component } from '@angular/core';
import { StateEmitter } from '@lithiumjs/angular';
import { Select, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { SessionState } from '../../../store/session/session.store';
import { HideBannerAction } from '../../../store/session/session.actions';
import { AotAware } from '@lithiumjs/angular/aot';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent extends AotAware {

  @StateEmitter.FromSelf()
  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Subject<boolean>;

  constructor(store: Store) {
    super();

    this.hideBanner$.subscribe(hideBanner => store.dispatch(new HideBannerAction(hideBanner)));
  }
}
