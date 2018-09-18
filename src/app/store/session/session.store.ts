import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Session } from '../../models/session';
import { SetAction, InvalidateAction, UpdateUserAction } from './session.actions';
import { User } from '../../models/user';

@State<Session>({
    name: 'session',
    defaults: null
})
export class SessionState {

    @Selector()
    public static getUser(session: Session): User {
        return session ? session.user : undefined;
    }

    @Selector()
    public static getTodoLists(session: Session): User.TodoListDictionary {
        return session ? session.user.todoLists : undefined;
    }

    @Action(SetAction)
    public set(context: SessionState.Context, { session }: SetAction) {
        context.setState(session);
    }

    @Action(InvalidateAction)
    public invalidate(context: SessionState.Context, _action: InvalidateAction) {
        context.setState(undefined);
    }

    @Action(UpdateUserAction)
    public updateUser(context: SessionState.Context, action: UpdateUserAction) {
        context.patchState(action);
    }
}

export namespace SessionState {

    export type Context = StateContext<Session>;
}
