import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Observable, Subject, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base-component';
import { ChangeDetectorRef, Injector } from '@angular/core';

export abstract class EntryBasePage extends BaseComponent {

    @EventSource()
    protected onSubmit$: Observable<void>;

    @StateEmitter()
    protected username$: Subject<string>;

    @StateEmitter()
    protected password$: Subject<string>;

    @StateEmitter({ readOnly: true })
    protected formSubmissionEnabled$: Subject<boolean>;

    @StateEmitter()
    protected error$: Subject<string>;

    constructor(injector: Injector, cdRef: ChangeDetectorRef, snackBar: MatSnackBar, ...fields: Observable<any>[]) {
        super(injector, cdRef);

        this.error$.pipe(
            filter<string>(Boolean)
        ).subscribe(error => {
            console.error(error);
            snackBar.open(error, 'Dismiss', { verticalPosition: 'top' });
        });

        // Only enable the submit button if the user entered all fields
        combineLatest(this.username$, this.password$, ...fields).pipe(
            map(_fields => _fields.every(Boolean))
        ).subscribe(this.formSubmissionEnabled$);
    }
}
