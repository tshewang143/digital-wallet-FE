import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { filter } from 'rxjs/operators';

export abstract class EntryBasePage {

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

    constructor(snackBar: MatSnackBar) {
        this.error$.pipe(
            filter(Boolean)
        ).subscribe(error => {
            console.error(error);
            snackBar.open(error, 'Dismiss', { verticalPosition: 'top' });
        });
    }
}
