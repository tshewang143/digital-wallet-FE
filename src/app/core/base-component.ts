import { AotAware, AutoPush } from '@lithiumjs/angular';
import { Injector, ChangeDetectorRef } from '@angular/core';

export class BaseComponent extends AotAware {

    constructor(
        protected readonly injector: Injector,
        cdRef?: ChangeDetectorRef
    ) {
        super();

        if (cdRef) {
            AutoPush.enable(this, cdRef);
        }
    }
}
