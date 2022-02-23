import { AutoPush } from '@lithiumjs/angular';
import { Injector, ChangeDetectorRef } from '@angular/core';

export class BaseComponent {

    constructor(
        protected readonly injector: Injector,
        cdRef?: ChangeDetectorRef
    ) {
        if (cdRef) {
            AutoPush.enable(this, cdRef);
        }
    }
}
