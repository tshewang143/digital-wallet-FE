import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Injector } from '@angular/core';
import { ComponentState, ComponentStateRef } from '@lithiumjs/angular';
import { Select, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { SessionState } from '../../../store/session/session.store';
import { HideBannerAction } from '../../../store/session/session.actions';
import { BaseComponent } from 'src/app/core/base-component';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
  providers: [ComponentState.create(HelpDialogComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpDialogComponent extends BaseComponent {
  
  @Select(SessionState.hideBanner)
  public readonly hideBanner$: Subject<boolean>;

  public hideBanner: boolean = false;

  constructor(injector: Injector, cdRef: ChangeDetectorRef, stateRef: ComponentStateRef<HelpDialogComponent>, store: Store) {
    super(injector, cdRef);

    stateRef.get('hideBanner').subscribe(hideBanner => store.dispatch(new HideBannerAction(hideBanner)));
  }
}
