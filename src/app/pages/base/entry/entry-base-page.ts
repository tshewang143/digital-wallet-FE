import { ComponentStateRef, DeclareState } from '@lithiumjs/angular';
import { Observable, combineLatest, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base-component';
import { ChangeDetectorRef, Directive, Injector } from '@angular/core';

@Directive()
export abstract class EntryBasePage extends BaseComponent {

    public readonly onSubmit$ = new Subject<void>();
    public formSubmissionEnabled = true;
    public username = '';
    public password = '';
    @DeclareState()
    public error?: string;

    constructor(
        injector: Injector,
        cdRef: ChangeDetectorRef,
        snackBar: MatSnackBar,
        ...fields: Observable<any>[]
    ) {
        super(injector, cdRef);

        const stateRef = injector.get<ComponentStateRef<EntryBasePage>>(ComponentStateRef);

        stateRef.get("error").pipe(
            filter<string>(Boolean)
        ).subscribe(error => {
            console.error(error);
            snackBar.open(error, 'Dismiss', { verticalPosition: 'top' });
        });

        // Only enable the submit button if the user entered all fields
        combineLatest([stateRef.get("username"), stateRef.get("password"), ...fields]).pipe(
            map(_fields => _fields.every(Boolean))
        ).subscribe(formSubmissionEnabled => this.formSubmissionEnabled = formSubmissionEnabled);
    }
}
