import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Session } from '../../models/session';
import { SetAction, InvalidateAction } from './session.actions';
import { User } from '../../models/user';

@State<Session>({
    name: 'session'
})
export class SessionState {

    @Selector()
    public static getUser(session: Session): User {
        return session ? session.user : undefined;
    }

    @Action(SetAction)
    public set(context: SessionState.Context, { session }: SetAction) {
        context.setState(session);
    }

    @Action(InvalidateAction)
    public invalidate(context: SessionState.Context, _action: InvalidateAction) {
        context.setState(undefined);
    }
}

export namespace SessionState {

    export type Context = StateContext<Session>;
}
