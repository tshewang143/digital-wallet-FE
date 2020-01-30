import { StateEmitter, EventSource, AotAware } from '@lithiumjs/angular';
import { Observable, Subject, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';

export abstract class EntryBasePage extends AotAware {

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

    constructor(snackBar: MatSnackBar, ...fields: Observable<any>[]) {
        super();

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
