import { Component, ChangeDetectionStrategy, Injector, ChangeDetectorRef, HostListener } from '@angular/core';
import { BaseComponent } from 'src/app/core/base-component';
import { Observable } from 'rxjs';
import { EventSource } from '@lithiumjs/angular';

@Component({
  selector: 'app-banner',
  templateUrl: './app-banner.component.html',
  styleUrls: ['./app-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBannerComponent extends BaseComponent {

  @HostListener('click')
  @EventSource()
  private readonly onClick$: Observable<void>;

  constructor(injector: Injector, cdRef: ChangeDetectorRef) {
    super(injector, cdRef);

    this.onClick$.subscribe(() => {
      const a = document.createElement('a');
      a.href = 'https://github.com/lVlyke/lithium-angular';
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
      a.remove();
    });
  }
}
