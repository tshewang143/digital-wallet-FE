import { Component } from '@angular/core';
import { StateEmitter } from '@lithiumjs/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { SessionState } from '../../../store/session/session.store';
import { mergeMap } from 'rxjs/operators';
import { HideBannerAction } from '../../../store/session/session.actions';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent {

  @Select(SessionState.hideBanner)
  public readonly _hideBanner$: Observable<boolean>;

  @StateEmitter.From('_hideBanner$')
  public readonly hideBanner$: Subject<boolean>;

  constructor(store: Store) {
    this.hideBanner$.pipe(
      mergeMap(hideBanner => store.dispatch(new HideBannerAction(hideBanner)))
    ).subscribe();
  }
}
