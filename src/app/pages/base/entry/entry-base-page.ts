import { StateEmitter, EventSource } from '@lithiumjs/angular';
import { Observable, Subject } from 'rxjs';

export abstract class EntryBasePage {

    @EventSource()
    protected onSubmit$: Observable<void>;

    @StateEmitter()
    protected username$: Subject<string>;

    @StateEmitter()
    protected password$: Subject<string>;

    @StateEmitter({ readOnly: true })
    protected formSubmissionEnabled$: Subject<boolean>;
}
